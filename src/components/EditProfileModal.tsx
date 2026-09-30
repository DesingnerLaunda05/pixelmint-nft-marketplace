import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, User, Sparkles, Check } from 'lucide-react';

const avatarPresets = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=myprofile',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=cyberking',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=neonqueen',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=matrixsamurai',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=pixelwizard',
];

export default function EditProfileModal() {
  const { user, editProfileOpen, setEditProfileOpen, updateProfile } = useMarketplace();
  const [formData, setFormData] = useState({
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    avatar: user.avatar,
    banner: user.banner,
    email: user.email || '',
  });

  if (!editProfileOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditProfileOpen(false)} />

      <div className="relative w-full max-w-lg glass rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Edit Profile</h3>
          </div>
          <button
            onClick={() => setEditProfileOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Avatar Preview & Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              <img
                src={formData.avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl bg-surface-800 border-2 border-brand-500 object-cover"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">Choose an avatar style or enter image URL below:</p>
                <div className="flex gap-2">
                  {avatarPresets.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, avatar: preset })}
                      className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        formData.avatar === preset ? 'border-brand-400 scale-110' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={preset} alt="" className="w-full h-full object-cover" />
                      {formData.avatar === preset && (
                        <div className="absolute inset-0 bg-brand-500/40 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="Or paste custom image URL"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="mt-2 w-full px-3 py-2 bg-surface-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Handle</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              placeholder="you@domain.com"
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Profile Banner URL</label>
            <input
              type="text"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glow flex-[2] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
