'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

type FileType = 'notes' | 'papers' | 'video';
type Subject = 'o-level-english' | 'a-level-english' | 'o-level-psychology';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subject: 'o-level-english' as Subject,
    type: 'notes' as FileType,
    file: null as File | null,
    videoUrl: '',
    year: '',
    topic: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type !== 'video' && !formData.file) {
      setUploadStatus('Please select a file');
      return;
    }
    if (formData.type === 'video' && !formData.videoUrl) {
      setUploadStatus('Please enter a video URL');
      return;
    }

    setUploadLoading(true);
    setUploadStatus('');

    try {
      let downloadURL = '';
      
      if (formData.type !== 'video' && formData.file) {
        const storageRef = ref(storage, `${formData.subject}/${formData.type}/${formData.file.name}`);
        const snapshot = await uploadBytes(storageRef, formData.file);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'resources'), {
        title: formData.title,
        subject: formData.subject,
        type: formData.type,
        url: formData.type === 'video' ? formData.videoUrl : downloadURL,
        fileName: formData.file?.name || '',
        year: formData.year,
        topic: formData.topic,
        createdAt: new Date()
      });

      setUploadStatus('Upload successful!');
      setFormData({
        title: '',
        subject: 'o-level-english',
        type: 'notes',
        file: null,
        videoUrl: '',
        year: '',
        topic: ''
      });
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Upload Resources
              </h3>
              
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value as Subject})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="o-level-english">O Level English</option>
                    <option value="a-level-english">A Level English</option>
                    <option value="o-level-psychology">O Level Psychology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as FileType})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="notes">Notes</option>
                    <option value="papers">Past Papers</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {formData.type === 'papers' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                {formData.type === 'video' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File</label>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Resource'}
                </button>
              </form>

              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-md ${uploadStatus.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}