// src/components/TherapistDashboard.tsx
import React, { useEffect, useState } from 'react';
import { fetchTherapistRequestsFor, updateRequestStatus } from '../utils/therapistApi';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { TherapistChat } from '/Users/shreyasingh/Downloads/MindPal-therapist_assistance 3/src/components/TherapistChat.tsx';

export const TherapistDashboard: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState<{ chatId: string; userId: string; userEmail?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        navigate('/');
        return;
      }
      // fetch therapist profile with retries; if none, allow inline creation instead of redirect
      let profileData = null;
      let attempt = 0;
      while (attempt < 3) {
        try {
          const res = await supabase
            .from('therapists')
            .select('*')
            .eq('id', user.id)
            .single();
          if (res.error) {
            // if 404-like (no rows) break and allow creation
            // log and continue to retry briefly
            console.warn('Therapist profile fetch attempt', attempt + 1, 'error:', res.error.message);
          } else if (res.data) {
            profileData = res.data;
            break;
          }
        } catch (err) {
          console.warn('Therapist profile fetch attempt', attempt + 1, 'failed:', err);
        }
        attempt += 1;
        // small delay before retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 350));
      }

      if (!profileData) {
        // Do NOT navigate away; show inline profile creation UI in the dashboard.
        console.warn('No therapist profile found after retries; showing inline profile setup');
        setProfile(null);
        setLoading(false);
        await loadRequests(user.id); // still try to load requests (will be empty)
        return;
      }

      setProfile(profileData);
      await loadRequests(user.id);
      setLoading(false);

      // Realtime subscription for new requests for this therapist
      const sub = supabase.channel('therapist-requests')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'therapist_requests', 
          filter: `therapist_id=eq.${user.id}` 
        }, payload => {
          setRequests(prev => [payload.new, ...prev]);
        })
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'therapist_requests', 
          filter: `therapist_id=eq.${user.id}` 
        }, payload => {
          setRequests(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(sub);
      };
    })();
  }, [navigate]);

  const loadRequests = async (therapistId: string) => {
    const { data, error } = await fetchTherapistRequestsFor(therapistId);
    if (error) {
      console.error('Error loading requests:', error);
    }
    setRequests(data || []);
  };

  const handleAccept = async (reqId: string) => {
    const { error } = await updateRequestStatus(reqId, 'accepted');
    if (error) {
      alert('Error accepting request: ' + error.message);
      return;
    }
    setRequests(prev => prev.map(r => (r.id === reqId ? { ...r, status: 'accepted' } : r)));
  };

  const handleReject = async (reqId: string) => {
    const { error } = await updateRequestStatus(reqId, 'rejected');
    if (error) {
      alert('Error rejecting request: ' + error.message);
      return;
    }
    setRequests(prev => prev.map(r => (r.id === reqId ? { ...r, status: 'rejected' } : r)));
  };

  const openChatWith = (userId: string) => {
    if (!profile?.id) return;
    const therapistId = profile.id;
    const chatId = `${userId}-${therapistId}`;
    setOpenChat({ chatId, userId });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
            <div className="text-sm text-gray-600">
              {profile?.name} • {profile?.specialization}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onBack && (
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
            )}
            <Button onClick={handleSignOut} variant="destructive">
              Sign out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600">Pending Requests</div>
            <div className="text-3xl font-bold text-orange-600">
              {pendingRequests.length}
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600">Active Connections</div>
            <div className="text-3xl font-bold text-green-600">
              {acceptedRequests.length}
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-sm text-gray-600">Total Requests</div>
            <div className="text-3xl font-bold text-blue-600">
              {requests.length}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Pending Requests */}
          <Card className="p-4 bg-white">
            <h3 className="font-semibold mb-4 text-lg">Pending Requests</h3>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <div className="text-sm text-gray-500">No pending requests</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {req.users?.email || req.user_id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(req.created_at).toLocaleString()}
                        </div>
                        {req.message && (
                          <div className="mt-2 text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                            {req.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 min-w-[140px]">
                        <Button 
                          onClick={() => { 
                            handleAccept(req.id); 
                            openChatWith(req.user_id); 
                          }} 
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          ✓ Accept & Chat
                        </Button>
                        <Button 
                          onClick={() => handleReject(req.id)} 
                          variant="outline" 
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          ✕ Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Connections */}
          <Card className="p-4 bg-white">
            <h3 className="font-semibold mb-4 text-lg">Active Connections</h3>
            {acceptedRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm text-gray-500">No active connections yet</div>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedRequests.map(req => (
                  <div key={req.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {req.users?.email || req.user_id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Connected: {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        onClick={() => openChatWith(req.user_id)} 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        💬 Open Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      {openChat && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenChat(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden">
            <TherapistChat
              chatId={openChat.chatId}
              therapistId={profile.id}
              userId={openChat.userId}
              onClose={() => setOpenChat(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};