import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { fetchStudentDashboard } from '../services/dashboardService';
import { submitAssignment, getFileUrl } from '../services/submissionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { pushToast } = useToast();

  const [data, setData] = useState({
    assignments: [],
    submissions: [],
    stats: {}
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    assignmentId: '',
    file: null
  });

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetchStudentDashboard();

      setData({
        assignments: response?.assignments || [],
        submissions: response?.submissions || [],
        stats: response?.stats || {}
      });

    } catch (err) {
      console.error(err);
      pushToast('Unable to load dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const submissionMap = useMemo(() => {
    const map = new Map();

    (data.submissions || []).forEach((submission) => {
      const id = submission.assignmentId;
      if (id) map.set(id, submission);
    });

    return map;
  }, [data.submissions]);

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.assignmentId || !form.file) {
      pushToast('Select assignment and upload file.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('file', form.file);
      formData.append('assignmentId', Number(form.assignmentId));
      formData.append('studentName', user?.name || "Student");

      await submitAssignment(formData);

      pushToast('Uploaded successfully!', 'success');

      setForm({ assignmentId: '', file: null });

      await loadDashboard();

    } catch (err) {
      console.error(err);
      pushToast('Upload failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="container mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-slate-200/60">
              Student dashboard
            </p>
            <h1 className="font-display text-3xl text-white mt-2">
              Welcome, {user?.name}
            </h1>
          </div>

          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <StatCard label="Assignments" value={data.stats?.totalAssignments || 0} hint="Total available" />
          <StatCard label="Submitted" value={data.stats?.submittedCount || 0} hint="Uploads done" />
          <StatCard label="Graded" value={data.stats?.gradedCount || 0} hint="Reviewed by teachers" />
          <StatCard label="Avg grade" value={`${Math.round(data.stats?.averageGrade || 0)}%`} hint="Across graded submissions" />
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* SUBMIT */}
          <motion.div className="glass-panel p-6">
            <SectionHeader
              title="Submit Assignment"
              subtitle="Upload your work as PDF or DOCX and track status instantly."
            />

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  Assignment
                </label>

                {/* ✅ FIXED DROPDOWN */}
                <select
                  className="input-field bg-transparent text-white"
                  style={{ backgroundColor: "transparent" }}
                  value={form.assignmentId}
                  onChange={(e) =>
                    setForm({ ...form, assignmentId: e.target.value })
                  }
                >
                  <option
                    value=""
                    style={{ backgroundColor: "#1e293b", color: "white" }}
                  >
                    Select assignment
                  </option>

                  {(data.assignments || []).map((a) => (
                    <option
                      key={a.id}
                      value={a.id}
                      style={{ backgroundColor: "#1e293b", color: "white" }}
                    >
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  Upload file
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="input-field"
                />
              </div>

              <button className="btn-primary w-full" type="submit" disabled={submitting}>
                {submitting ? "Uploading..." : "Submit assignment"}
              </button>

            </form>
          </motion.div>

          {/* ASSIGNMENTS */}
          <motion.div className="glass-panel p-6">
            <SectionHeader
              title="My Assignments"
              subtitle="Check deadlines and submission progress."
            />

            {(data.assignments || []).map((a) => {
              const sub = submissionMap.get(a.id);

              return (
                <div key={a.id} className="border border-white/10 p-4 rounded-xl mb-4">
                  <h3 className="text-white font-semibold">{a.title}</h3>

                  <p className="text-sm text-slate-200/70">
                    Status: {sub?.status || "Pending"}
                  </p>

                  <p className="text-sm text-slate-200/70">
                    Grade: {sub?.grade ?? "-"}
                  </p>

                  <p className="text-sm text-slate-200/70">
                    Feedback: {sub?.feedback ?? "-"}
                  </p>

                  {sub?.fileName && (
                    <a
                      href={getFileUrl(sub.fileName)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline"
                    >
                      View File
                    </a>
                  )}
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* TABLE */}
        <div className="mt-10 glass-panel p-6">
          <SectionHeader title="Submission Status" />

          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Feedback</th>
                <th>File</th>
              </tr>
            </thead>

            <tbody>
              {(data.submissions || []).map((s) => (
                <tr key={s.id}>
                  <td>{s.assignmentId}</td>
                  <td>{s.status}</td>
                  <td>{s.grade ?? "-"}</td>
                  <td>{s.feedback ?? "-"}</td>
                  <td>
                    {s.fileName && (
                      <a
                        href={getFileUrl(s.fileName)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline"
                      >
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;