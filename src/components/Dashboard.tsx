import { useState, useEffect } from 'react';
import { Bookmark, LogOut, Plus, Trash2, ExternalLink, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Bookmark as BookmarkType } from '../lib/supabase';
import AddBookmarkModal from './AddBookmarkModal';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  fetchBookmarks();

  console.log('Setting up Realtime subscription for user:', user?.id);

  const channel = supabase
    .channel('bookmarks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${user?.id}`,
      },
      (payload) => {
        console.log('🔥 Realtime event received:', payload);
        
        if (payload.eventType === 'INSERT') {
          console.log('➕ Adding new bookmark:', payload.new);
          setBookmarks((current) => [payload.new as BookmarkType, ...current]);
        } else if (payload.eventType === 'DELETE') {
          console.log('🗑️ Deleting bookmark:', payload.old.id);
          setBookmarks((current) => current.filter((b) => b.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          console.log('✏️ Updating bookmark:', payload.new);
          setBookmarks((current) =>
            current.map((b) => (b.id === payload.new.id ? (payload.new as BookmarkType) : b))
          );
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Realtime subscription status:', status);
    });

  return () => {
    console.log('Cleaning up Realtime subscription');
    supabase.removeChannel(channel);
  };
}, [user?.id]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

const deleteBookmark = async (id: string) => {
  try {
    // Optimistically update UI immediately
    setBookmarks((current) => current.filter((b) => b.id !== id));
    
    // Then delete from database
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    
    if (error) {
      // If delete failed, revert by refetching
      fetchBookmarks();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    alert('Failed to delete bookmark');
  }
};

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarks</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Bookmarks</h2>
              <p className="text-gray-600 mt-1">
                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Bookmark
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Start by adding your first bookmark'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Your First Bookmark
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{bookmark.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Added {new Date(bookmark.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {showAddModal && <AddBookmarkModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
