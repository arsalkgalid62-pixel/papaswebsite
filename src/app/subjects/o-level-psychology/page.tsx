'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  type: 'notes' | 'papers' | 'video';
  url: string;
  fileName?: string;
  year?: string;
  topic?: string;
  createdAt: any;
}

export default function OLevelPsychology() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'notes' | 'papers' | 'video'>('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const q = query(
        collection(db, 'resources'),
        where('subject', '==', 'o-level-psychology'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(resource => resource.type === filter);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">O Level Psychology</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                All Resources
              </button>
              <button
                onClick={() => setFilter('notes')}
                className={`px-4 py-2 rounded-md ${filter === 'notes' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                📄 Notes
              </button>
              <button
                onClick={() => setFilter('papers')}
                className={`px-4 py-2 rounded-md ${filter === 'papers' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                📋 Past Papers
              </button>
              <button
                onClick={() => setFilter('video')}
                className={`px-4 py-2 rounded-md ${filter === 'video' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                🎥 Videos
              </button>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                No resources available yet. Check back soon!
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {resource.type === 'notes' && <span className="text-2xl">📄</span>}
                        {resource.type === 'papers' && <span className="text-2xl">📋</span>}
                        {resource.type === 'video' && <span className="text-2xl">🎥</span>}
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {resource.type === 'notes' && 'Study Notes'}
                            {resource.type === 'papers' && `Past Paper ${resource.year || ''}`}
                            {resource.type === 'video' && 'Video Lesson'}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {resource.title}
                          </dd>
                          {resource.topic && (
                            <dd className="text-sm text-gray-600">
                              Topic: {resource.topic}
                            </dd>
                          )}
                        </dl>
                      </div>
                    </div>
                    
                    {resource.type === 'video' ? (
                      <div className="mt-4">
                        <iframe
                          width="100%"
                          height="200"
                          src={getYouTubeEmbedUrl(resource.url)}
                          title={resource.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-md"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Download {resource.fileName || 'File'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}