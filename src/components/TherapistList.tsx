import React, { useState, useEffect } from 'react';
import { fetchTherapists, sendConnectionRequest, fetchUserRequestsSent } from '../utils/therapistApi';
import { supabase } from '../utils/supabase/client';
import { Card } from './ui/card';
import { Button } from './ui/button';

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userRequests, setUserRequests] = useState<{ [key: string]: any }>({});
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    (async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        // Fetch user's sent requests
        const res = await fetchUserRequestsSent(user.id);
        const reqMap: { [key: string]: any } = {};
        if (!res.error && res.data) {
          res.data.forEach((req: any) => {
            reqMap[req.therapist_id] = req;
          });
        }
        setUserRequests(reqMap);

        // Subscribe to request status updates
        supabase.channel('user-requests')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'therapist_requests',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            setUserRequests(prev => ({
              ...prev,
              [payload.new.therapist_id]: payload.new
            }));
          })
          .subscribe();
      }

      // Fetch therapists
      try {
        const res = await fetchTherapists();
        const data = res?.data;
        const error = (res as any)?.error;
        console.debug('fetchTherapists response', { data, error });
        if (error) {
          console.error('Error fetching therapists:', error);
          setTherapists([]);
        } else {
          setTherapists(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching therapists:', err);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRequest = async (therapistId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in first.');
      return;
    }
    
    const res = await sendConnectionRequest({
      user_id: user.id,
      therapist_id: therapistId,
      message,
    });

    console.debug('sendConnectionRequest response', res);

    const error = (res as any)?.error;
    if (error) {
      alert('Error sending request: ' + error.message);
    } else {
      alert('Connection request sent.');
      setMessage('');
    }
  };

  if (loading) return <div className="p-6">Loading therapists...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Therapists</h2>

      <textarea
        className="w-full p-3 rounded border mb-4"
        placeholder="Personal message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      {therapists.length === 0 ? (
        <div className="p-6 text-gray-600">No therapists available right now. Please check back later.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {therapists.map(t => {
            const userRequest = userRequests[t.id];
            const requestStatus = userRequest?.status;
            
            return (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-600">{t.specialization}</p>
                    <p className="text-xs text-gray-500">
                      {t.experience} • {t.languages?.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">⭐ {Number(t.rating || 5).toFixed(1)}</div>
                    <div className="text-sm text-gray-500">{t.response_time}</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-700">{t.description}</p>

                {/* Show request status */}
                {requestStatus && (
                  <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200">
                    {requestStatus === 'pending' && (
                      <p className="text-sm text-blue-700">⏳ Request Pending</p>
                    )}
                    {requestStatus === 'accepted' && (
                      <p className="text-sm text-green-700">✓ Connection Accepted - Chat is ready!</p>
                    )}
                    {requestStatus === 'rejected' && (
                      <p className="text-sm text-red-700">✕ Request Declined</p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center gap-2">
                  <div className="text-lg font-semibold">₹{t.price || 0}/session</div>
                  {!requestStatus ? (
                    <Button
                      onClick={() => handleRequest(t.id)}
                      className="bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    >
                      Request Connection
                    </Button>
                  ) : requestStatus === 'accepted' ? (
                    <Button
                      onClick={() => {
                        // Open chat
                        const chatId = `${currentUserId}-${t.id}`;
                        window.location.href = `/chat/${chatId}`;
                      }}
                      className="bg-green-600 text-white rounded-full hover:bg-green-700"
                    >
                      Open Chat
                    </Button>
                  ) : (
                    <Button disabled className="bg-gray-400 text-white rounded-full">
                      {requestStatus === 'pending' ? 'Pending...' : 'Declined'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};