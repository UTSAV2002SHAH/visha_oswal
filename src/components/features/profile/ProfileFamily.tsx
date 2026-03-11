"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';
import { CloseIcon } from '../../ui/icons/CloseIcon';
import { getImageUrl } from '@/lib/image-utils';
import { FamilyMemberModal } from './FamilyMemberModal';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import { isProfileComplete } from '@/utils/profile-validation';
import Link from 'next/link';

interface FamilyMember {
    user: string | null;
    name: string;
    status: 'PENDING' | 'ACCEPTED' | null;
    manualImage: string | null;
    _id?: string;
}

interface ProfileFamilyProps {
    profileData: any;
    isOwnProfile: boolean;
    onUpdate: () => void;
}

export const ProfileFamily: React.FC<ProfileFamilyProps> = ({ profileData, isOwnProfile, onUpdate }) => {
    const { user: currentUser } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [familyData, setFamilyData] = useState<any>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRelationType, setModalRelationType] = useState<'father' | 'mother' | 'spouse' | 'sibling' | 'child'>('father');

    const handleOpenModal = (relationType: 'father' | 'mother' | 'spouse' | 'sibling' | 'child') => {
        setModalRelationType(relationType);
        setIsModalOpen(true);
    };

    const handleDeleteMember = async (relationType: string, memberId?: string) => {
        if (!confirm(`Are you sure you want to remove this entry?`)) return;

        const token = localStorage.getItem('token');
        try {
            // Map front-end relation names to the backend's [relationType] route param names
            const routeType = relationType === 'father' || relationType === 'mother'
                ? relationType
                : relationType === 'sibling' ? 'siblings'
                    : relationType === 'child' ? 'children'
                        : relationType;

            const deleteUrl = `/api/member-profile/family/${routeType}${memberId ? `?memberId=${memberId}` : ''}`;

            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Removed successfully");
                onUpdate();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to remove");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    useEffect(() => {
        const fetchFamilyData = async () => {
            setIsLoading(true);
            try {
                // If viewing someone else, we might need a specific endpoint or they're included in profile
                // Currently, API GET /api/member-profile gets our own.
                // If it's another user, we might need to rely on the expanded profileData passed down.
                // For now, let's fetch our own from /api/member-profile if it's our profile.
                if (isOwnProfile) {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/member-profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setFamilyData(data.family || { father: null, mother: null, spouse: null, siblings: [], children: [] });
                    }
                } else {
                    // For public profiles, we need to ensure the backend returns the public family data.
                    // Assuming profileData.extendedProfile.family exists if public. 
                    // (We need to update the public profile API in Phase 9b to return this, will do next if needed)
                    setFamilyData(profileData?.extendedProfile?.family || { father: null, mother: null, spouse: null, siblings: [], children: [] });
                }
            } catch (error) {
                console.error("Failed to fetch family data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFamilyData();
    }, [isOwnProfile, profileData]);

    if (isLoading || !familyData) {
        return <div className="flex justify-center items-center py-12"><SpinnerIcon className="w-8 h-8 animate-spin text-orange-500" /></div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-4 md:p-8 border border-slate-100 dark:border-slate-800 transition-all">
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Family Tree</h2>
                {isOwnProfile && (
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Interactive Mode</span>
                )}
            </div>

            {/* Complete Profile Nudge */}
            {isOwnProfile && !isProfileComplete(profileData?.personal) && (
                <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-subtle">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900 dark:text-orange-100 text-sm">Complete Your Personal Info</h3>
                            <p className="text-orange-700 dark:text-orange-300 text-xs text-center md:text-left">Adding your gender and birth date helps build a better family tree.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('tab', 'overview');
                            window.history.pushState({}, '', url.toString());
                            window.dispatchEvent(new Event('popstate'));
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                        Complete Now
                    </button>
                </div>
            )}

            {/* Scrollable Container for Mobile */}
            <div className="w-full overflow-x-auto custom-scrollbar pb-6">
                <div className="min-w-[600px] md:min-w-full flex flex-col items-center gap-8 md:gap-10 py-4">

                    {/* Tier 1: Parents */}
                    <div className="flex flex-col items-center relative w-full mb-4">
                        <div className="flex justify-center gap-12 md:gap-24 relative z-10 bg-white dark:bg-slate-900 py-2">
                            {/* Father Card */}
                            <MemberCard
                                member={familyData.father}
                                relation="Father"
                                isOwnProfile={isOwnProfile}
                                onAdd={() => handleOpenModal('father')}
                                onDelete={() => handleDeleteMember('father')}
                            />

                            {/* Connection Line Between Parents */}
                            <div className="absolute top-[50px] md:top-[60px] left-1/4 right-1/4 h-[3px] bg-slate-200 dark:bg-slate-700 -z-10"></div>

                            {/* Mother Card */}
                            <MemberCard
                                member={familyData.mother}
                                relation="Mother"
                                isOwnProfile={isOwnProfile}
                                onAdd={() => handleOpenModal('mother')}
                                onDelete={() => handleDeleteMember('mother')}
                            />
                        </div>
                        {/* Vertical branch down from parents junction */}
                        <div className="w-[3px] h-6 bg-slate-200 dark:bg-slate-700 mt-[-10px]"></div>
                    </div>

                    {/* Tier 2: Siblings and User (Horizontal Row) */}
                    <div className="flex flex-col items-center w-full relative">
                        {/* Horizontal connector for siblings */}
                        {(familyData.siblings?.length > 0) && (
                            <div className="absolute top-0 left-0 right-0 flex justify-center h-[3px]">
                                <div
                                    className="bg-slate-200 dark:bg-slate-700"
                                    style={{
                                        width: `${(familyData.siblings.length) * 120}px`,
                                        maxWidth: '90%'
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-center items-end gap-10 md:gap-14 relative w-full pt-6 pb-2">
                            {/* Siblings */}
                            {familyData.siblings?.map((sibling: FamilyMember, index: number) => (
                                <div key={sibling._id || index} className="relative flex flex-col items-center">
                                    <div className="absolute -top-6 left-1/2 w-[3px] h-6 bg-slate-200 dark:bg-slate-700"></div>
                                    <MemberCard
                                        member={sibling}
                                        relation="Sibling"
                                        isOwnProfile={isOwnProfile}
                                        onDelete={() => handleDeleteMember('sibling', sibling._id)}
                                    />
                                </div>
                            ))}

                            {/* Main User Card (Slightly larger) */}
                            <div className="relative flex flex-col items-center z-20">
                                <div className="absolute -top-6 left-1/2 w-[3px] h-6 bg-slate-200 dark:bg-slate-700"></div>
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-3 overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl ring-4 ring-orange-500 transition-transform hover:scale-105">
                                    <img
                                        src={getImageUrl(profileData?.profilePictureUrl)}
                                        alt="You"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=You' }}
                                    />
                                </div>
                                <span className="font-black text-sm md:text-base text-slate-900 dark:text-white uppercase tracking-wider">You</span>
                                {isOwnProfile && (
                                    <button onClick={() => handleOpenModal('sibling')} className="text-[10px] text-orange-500 hover:text-orange-600 mt-2 transition-colors flex items-center gap-1 font-bold">
                                        <span className="text-sm">+</span> Sibling
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vertical Line to Spouse Tier */}
                    <div className="w-[3px] h-8 bg-slate-200 dark:bg-slate-700 my-[-10px] z-0"></div>

                    {/* Tier 3: Spouse (Directly below user) */}
                    <div className="flex flex-col items-center relative w-full">
                        <MemberCard
                            member={familyData.spouse}
                            relation="Spouse"
                            isOwnProfile={isOwnProfile}
                            onAdd={() => handleOpenModal('spouse')}
                            onDelete={() => handleDeleteMember('spouse')}
                        />

                        {/* Vertical connection if there are children */}
                        {(familyData.children?.length > 0 || (isOwnProfile && familyData.spouse)) && (
                            <div className="w-[3px] h-8 bg-slate-200 dark:bg-slate-700 mt-2"></div>
                        )}
                    </div>

                    {/* Tier 4: Children (Horizontal Row below spouse) */}
                    <div className="flex flex-col items-center w-full relative mt-[-10px]">
                        {/* Horizontal connector for children */}
                        {(familyData.children?.length > 0 || isOwnProfile) && (
                            <div className="flex justify-center w-full h-[3px]">
                                <div
                                    className="bg-slate-200 dark:bg-slate-700"
                                    style={{
                                        width: `${(familyData.children.length + (isOwnProfile ? 1 : 0)) * 100}px`,
                                        maxWidth: '90%'
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-center gap-10 md:gap-14 relative w-full pt-6">
                            {/* Children Cards */}
                            {familyData.children?.map((child: FamilyMember, index: number) => (
                                <div key={child._id || index} className="relative flex flex-col items-center">
                                    {/* Vertical branch up */}
                                    <div className="absolute -top-6 left-1/2 w-[3px] h-6 bg-slate-200 dark:bg-slate-700"></div>
                                    <MemberCard
                                        member={child}
                                        relation="Child"
                                        isOwnProfile={isOwnProfile}
                                        onDelete={() => handleDeleteMember('child', child._id)}
                                    />
                                </div>
                            ))}

                            {/* Add Child Button */}
                            {isOwnProfile && (
                                <div className="flex flex-col items-center relative">
                                    <div className="absolute -top-6 left-1/2 w-[3px] h-6 bg-slate-200 dark:bg-slate-700"></div>
                                    <button onClick={() => handleOpenModal('child')} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-dashed border-orange-300 dark:border-orange-800 flex items-center justify-center text-orange-400 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all shadow-sm">
                                        <span className="text-3xl font-light">+</span>
                                    </button>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest text-center">Add Child</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FamilyMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                relationType={modalRelationType}
                onSuccess={onUpdate}
            />
        </div>
    );
};

// Helper Component for consistency
const MemberCard = ({ member, relation, isOwnProfile, onAdd, onDelete }: { member: any, relation: string, isOwnProfile: boolean, onAdd?: () => void, onDelete?: () => void }) => {

    // Check if the member has a platform user linked
    const linkedUsername = member?.user?.username;

    const Content = (
        <div className="flex flex-col items-center group relative animate-fade-in cursor-pointer">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 overflow-hidden border-[3px] transition-all duration-300 relative shadow-md ${member ? 'border-slate-200 dark:border-slate-700 group-hover:border-orange-400 group-hover:shadow-lg' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'}`}>
                {member ? (
                    <>
                        <img
                            src={getImageUrl(member.manualImage || (member.user?.profilePictureUrl || member.user?.profile?.profilePictureUrl))}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random` }}
                        />
                        {isOwnProfile && (
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(); }}
                                className="absolute top-1 right-1 bg-white/95 dark:bg-slate-800/95 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-20 border border-slate-100 dark:border-slate-700"
                                title="Remove"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <span className="text-[10px] uppercase tracking-tighter font-black">{relation}</span>
                        <span className="text-[8px] mt-1 font-bold">+</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center max-w-[100px]">
                <span className={`font-bold text-xs md:text-sm text-center truncate w-full ${member ? 'text-slate-800 dark:text-slate-200 group-hover:text-orange-600' : 'text-slate-400 font-normal italic'}`}>
                    {member?.name || "Not Added"}
                </span>

                {isOwnProfile && !member && (
                    <button onClick={onAdd} className="text-[10px] text-orange-500 hover:text-orange-600 mt-1 cursor-pointer font-black uppercase tracking-widest transition-colors hover:underline">Add</button>
                )}

                {member?.status === 'PENDING' && (
                    <span className="text-[8px] md:text-[9px] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 px-2 py-0.5 rounded-full mt-1 font-bold animate-pulse">PENDING</span>
                )}
            </div>
        </div>
    );

    if (linkedUsername) {
        return (
            <Link href={`/profile/${linkedUsername}`} className="no-underline">
                {Content}
            </Link>
        );
    }

    return Content;
};
