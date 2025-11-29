// src/utils/therapistApi.ts
import { supabase } from './supabase/client';

export const signUpUser = async (data: { email: string; password: string; role?: string; metadata?: any }) => {
  return await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: data.metadata || {},
    },
  });
};

export const signIn = async (data: { email: string; password: string }) => {
  return await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
};

export const createTherapistProfile = async (profile: any) => {
  return await supabase.from('therapists').insert(profile);
};

export const fetchTherapists = async () => {
  return await supabase
    .from('therapists')
    .select('*')
    .order('rating', { ascending: false });
};

export const fetchTherapistRequestsFor = async (therapistId: string) => {
  // Try to fetch requests including user metadata. If the users relation is blocked
  // by RLS, fallback to fetching only therapist_requests rows.
  const res = await supabase
    .from('therapist_requests')
    .select('*, users(*)')
    .eq('therapist_id', therapistId)
    .order('created_at', { ascending: false });

  if ((res as any)?.error) {
    // Fallback without joining users
    return await supabase
      .from('therapist_requests')
      .select('*')
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false });
  }

  return res;
};

// Fetch all requests sent BY a user to see their connection status with therapists
export const fetchUserRequestsSent = async (userId: string) => {
  return await supabase
    .from('therapist_requests')
    .select('*, therapists(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

export const updateRequestStatus = async (requestId: string, status: string) => {
  return await supabase
    .from('therapist_requests')
    .update({ status })
    .eq('id', requestId);
};

export const sendConnectionRequest = async (data: { user_id: string; therapist_id: string; message: string }) => {
  return await supabase.from('therapist_requests').insert({
    user_id: data.user_id,
    therapist_id: data.therapist_id,
    message: data.message,
    status: 'pending',
  });
};

export const fetchMessages = async (chatId: string) => {
  return await supabase
    .from('therapist_chat')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
};

export const sendMessage = async (chatId: string, senderId: string, receiverId: string, message: string) => {
  return await supabase.from('therapist_chat').insert({
    chat_id: chatId,
    sender_id: senderId,
    receiver_id: receiverId,
    message,
  });
};

export const subscribeToChat = (chatId: string, onMessage: (msg: any) => void) => {
  return supabase
    .channel(`chat:${chatId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `chat_id=eq.${chatId}`,
    }, (payload) => {
      onMessage(payload.new);
    })
    .subscribe();
};