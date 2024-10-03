
import React, { useState } from 'react';

export interface UserProfileCard {
    id: string;
    username: string;
    email: string;
    avatar: string;
}


const convertToUserProfileCard = (response: any | undefined): UserProfileCard => {
    return {
        id: response.userId,
        username: response.username,
        email: response.gmail,
        avatar: "https://picsum.photos/1000",
    };
};

export const fetchUserProfile = async (id: string | undefined): Promise<UserProfileCard> => {
    const response = await fetch(`http://localhost:5296/api/user/read/${id}`);
    const responseModel = await response.json();
    console.log("fetch user data", responseModel.data);

    const userProfile: UserProfileCard = convertToUserProfileCard(responseModel.data);
    return userProfile;
};

export const UserProfilePage: React.FC<{ userProfile: UserProfileCard }> = ({ userProfile }) => {
    // Local state to manage the form data
    const [profile, setProfile] = useState(userProfile);

    // Handler for form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    // Save profile handler (you can add functionality here to save it to a database or API)
    const handleSave = () => {
        console.log("Profile saved:", profile);
        // Add API call or save logic here
    };

    return (
        <section className="h-100 gradient-custom-2">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center">
                    <div className="col col-lg-9 col-xl-8">
                        <div className="card">
                            <div
                                className="rounded-top text-white d-flex flex-row"
                                style={{ backgroundColor: '#000', height: '200px' }}
                            >
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                        alt="Generic placeholder"
                                        className="img-fluid img-thumbnail mt-4 mb-2"
                                        style={{ width: '150px', zIndex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark text-body"
                                        style={{ zIndex: 1 }}
                                    >
                                        Edit profile
                                    </button>
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <h5>Andy Horwitz</h5>
                                    <p>New York</p>
                                </div>
                            </div>
                            <div className="p-4 text-black bg-body-tertiary">
                                <div className="d-flex justify-content-end text-center py-1 text-body">
                                    <div>
                                        <p className="mb-1 h5">253</p>
                                        <p className="small text-muted mb-0">Photos</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-1 h5">1026</p>
                                        <p className="small text-muted mb-0">Followers</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 h5">478</p>
                                        <p className="small text-muted mb-0">Following</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4 text-black">
                                <div className="mb-5 text-body">
                                    <p className="lead fw-normal mb-1">About</p>
                                    <div className="p-4 bg-body-tertiary">
                                        <p className="font-italic mb-1">Web Developer</p>
                                        <p className="font-italic mb-1">Lives in New York</p>
                                        <p className="font-italic mb-0">Photographer</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4 text-body">
                                    <p className="lead fw-normal mb-0">Recent photos</p>
                                    <p className="mb-0"><a href="#!" className="text-muted">Show all</a></p>
                                </div>
                                <div className="row g-2">
                                    <div className="col mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                                            alt="image 1"
                                            className="w-100 rounded-3"
                                        />
                                    </div>
                                    <div className="col mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                                            alt="image 2"
                                            className="w-100 rounded-3"
                                        />
                                    </div>
                                </div>
                                <div className="row g-2">
                                    <div className="col">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                                            alt="image 3"
                                            className="w-100 rounded-3"
                                        />
                                    </div>
                                    <div className="col">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                                            alt="image 4"
                                            className="w-100 rounded-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

