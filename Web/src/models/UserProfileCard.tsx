import React, { useState } from 'react';

export interface UserProfileCard {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    status: number;
    fullname: string | null;
    sex: string | null;
    createDate: string;
    sellConfigId: string | null;
    bio: string | null;
    birthday: string | null;
    roles: string[];
}

const convertToUserProfileCard = (response: any | undefined): UserProfileCard => {
    return {
        id: response.userId,
        username: response.username,
        email: response.gmail,
        avatar: response.avatar ?? "https://via.placeholder.com/120",
        phone: response.phone ?? "",
        address: response.address ?? "",
        status: response.status,
        fullname: response.fullname ?? "Anonymous",
        sex: response.sex ?? "Not Specified",
        createDate: response.createDate,
        sellConfigId: response.sellConfigId ?? null,
        bio: response.bio ?? "No bio provided",
        birthday: response.birthday ?? "Not Provided",
        roles: response.roles ?? []
    };
};

export const fetchUserProfile = async (id: string | undefined): Promise<UserProfileCard> => {
    const response = await fetch(`http://localhost:5296/api/user/read/${id}`);
    const responseModel = await response.json();
    const userProfile: UserProfileCard = convertToUserProfileCard(responseModel.data);
    return userProfile;
};

export const UserProfilePage: React.FC<{ userProfile: UserProfileCard }> = ({ userProfile }) => {
    const [profile, setProfile] = useState(userProfile);
    const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar || "https://via.placeholder.com/120");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setProfile({ ...profile, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const userUpdateDto = {
            UserId: profile.id,
            SellConfigId: profile.sellConfigId,
            Username: profile.username,
            Password: null,
            Gmail: profile.email,
            Fullname: profile.fullname,
            Sex: profile.sex,
            Phone: profile.phone,
            Address: profile.address,
            Avatar: profile.avatar,
            Birthday: profile.birthday,
            Bio: profile.bio,
        };

        try {
            const response = await fetch(`http://localhost:5296/api/user/update/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userUpdateDto), // Send the DTO
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(convertToUserProfileCard(updatedProfile.data));
                alert('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData);
                alert(`Error: ${errorData.title || 'Error updating profile'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    return (
        <div className="container">
            <div className="body">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card shadow-lg card-hover">
                            <div className="card-body text-center">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="rounded-circle avatar-img"
                                    width="110"
                                    height="110"
                                />
                                <div className="mt-3">
                                    <input type="file" className="form-control" onChange={handleAvatarChange} accept="image/*" />
                                </div>
                                <div className="mt-4">
                                    <h4>{profile.username}</h4>
                                    <p className="text-secondary mb-1">{profile.bio}</p>
                                    <p className="text-muted font-size-sm">Joined: {new Date(profile.createDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card shadow-lg card-hover">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Full Name</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullname"
                                            value={profile.fullname || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            value={profile.email || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Phone</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            value={profile.phone || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Sex</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <select className="form-select" name="sex" value={profile.sex || ''} onChange={handleChange}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Not Specified">Not Specified</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Bio</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <textarea
                                            className="form-control"
                                            name="bio"
                                            value={profile.bio || ''}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Birthday</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="birthday"
                                            value={profile.birthday || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-9 text-secondary">
                                        <button className="btn btn-primary px-4 btn-hover" onClick={handleSave}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
