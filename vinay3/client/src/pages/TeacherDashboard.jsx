import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { fetchTeacherDashboard } from '../services/dashboardService';
import { createAssignment, fetchAssignments } from '../services/assignmentService';
import { fetchSubmissionsByAssignment, gradeSubmission, getFileUrl } from '../services/submissionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { pushToast } = useToast();

  const [stats, setStats] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [grading, setGrading] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, assignmentsData] = await Promise.all([
        fetchTeacherDashboard(),
        fetchAssignments()
      ]);

      setStats(statsData?.stats || {});
      setAssignments(assignmentsData || []);
    } catch (err) {
      pushToast('Unable to load dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.dueDate) {
      pushToast('Complete all fields.', 'error');
      return;
    }

    setCreating(true);
    try {
      await createAssignment(form);
      pushToast('Assignment created.', 'success');
      setForm({ title: '', description: '', dueDate: '' });
      loadDashboard();
    } catch {
      pushToast('Error creating assignment.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const loadSubmissions = async (assignmentId) => {
    if (!assignmentId) return;

    try {
      const data = await fetchSubmissionsByAssignment(Number(assignmentId));
      setSubmissions(data || []);
    } catch {
      pushToast('Failed to load submissions.', 'error');
    }
  };

  const handleGradeChange = (id, field, value) => {
    setGrading((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleGradeSubmit = async (id) => {
    const payload = grading[id];

    if (!payload?.grade && payload?.grade !== 0) {
      pushToast('Enter valid grade.', 'error');
      return;
    }

    try {
      await gradeSubmission(id, {
        grade: Number(payload.grade),
        feedback: payload.feedback || ''
      });

      pushToast('Grade saved.', 'success');
      loadSubmissions(selectedAssignment);
    } catch {
      pushToast('Unable to grade.', 'error');
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="container mx-auto">

        {/* ✅ UPDATED HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-slate-200/60">
              Teacher dashboard
            </p>
            <h1 className="font-display text-3xl text-white mt-2">
              Welcome, {user?.name}
            </h1>
          </div>

          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Assignments" value={stats?.totalAssignments || 0} />
          <StatCard label="Submissions" value={stats?.submittedCount || 0} />
          <StatCard label="Graded" value={stats?.gradedCount || 0} />
          <StatCard label="Avg Grade" value={`${stats?.averageGrade || 0}%`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <motion.div className="glass-panel p-6">
            <SectionHeader title="Create Assignment" />

            <form onSubmit={handleCreate} className="space-y-4">
              <input className="input-field" placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea className="input-field" placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input type="date" className="input-field"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />

              <button className="btn-primary w-full">
                {creating ? "Creating..." : "Create assignment"}
              </button>
            </form>
          </motion.div>

          <motion.div className="glass-panel p-6">
            <SectionHeader title="All Assignments" />

            {assignments.map((a) => (
              <div key={a.id} className="mb-4">
                <p className="text-white font-semibold">{a.title}</p>
                <p className="text-slate-300">{a.description}</p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* SUBMISSIONS */}
        <div className="mt-10 glass-panel p-6">
          <SectionHeader title="View Submissions" />

          <select
            className="input-field bg-transparent text-white mb-4"
            value={selectedAssignment}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedAssignment(val);
              loadSubmissions(val);
            }}
          >
            <option value="" style={{ color: "black" }}>
              Select assignment
            </option>

            {assignments.map((a) => (
              <option key={a.id} value={a.id} style={{ color: "black" }}>
                {a.title}
              </option>
            ))}
          </select>

          {submissions.length === 0 && (
            <p className="text-slate-300">No submissions yet.</p>
          )}

          {submissions.map((s) => (
            <div key={s.id} className="mb-4 border p-4 rounded-lg">

              <p><b>Student:</b> {s.studentName}</p>
              <p><b>Status:</b> {s.status}</p>

              {s.fileName && (
                <a
                  href={getFileUrl(s.fileName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  View File
                </a>
              )}

              <input
                type="number"
                min="0"
                max="10"
                className="input-field mt-2"
                placeholder="Grade (0-10)"
                value={grading[s.id]?.grade || ''}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value > 10) value = 10;
                  if (value < 0) value = 0;
                  handleGradeChange(s.id, 'grade', value);
                }}
              />

              <input
                className="input-field mt-2"
                placeholder="Feedback"
                value={grading[s.id]?.feedback || ''}
                onChange={(e) =>
                  handleGradeChange(s.id, 'feedback', e.target.value)
                }
              />

              <button
                className="btn-primary mt-2"
                onClick={() => handleGradeSubmit(s.id)}
              >
                Save Grade
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;