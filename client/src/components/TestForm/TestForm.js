import React, { useState } from 'react';
import '../TestForm/testform.css';

const MAX_BIO_LENGTH = 120;

export default function TestForm({ setFormOpened, setMintNftPayload, socket }) {
    const [formData, setFormData] = useState({
        username: '',
        country: '',
        email: '',
        profilePicture: null,
        profilePictureName: '',
        bio: '',
        profession: '',
        experience: '',
    });

    const [errors, setErrors] = useState({});

    function closeForm() {
        setFormOpened(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, profilePicture: file, profilePictureName: e.target.files[0].name });
    };

    const handleBioChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, bio: value });

        // Check bio length and set error if it exceeds the limit
        if (value.length > MAX_BIO_LENGTH) {
            setErrors({ ...errors, bio: `Bio must be at most ${MAX_BIO_LENGTH} characters` });
        } else {
            setErrors({ ...errors, bio: '' });
        }
    };

    const validateEmail = (email) => {
        // Email validation using a regular expression
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validate email (optional)
        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Validate username (required)
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        // Validate profile picture (required)
        if (!formData.profilePicture) {
            newErrors.profilePicture = 'Profile picture is required';
        } else {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(formData.profilePicture.type)) {
                newErrors.profilePicture = 'Invalid file type. Please use PNG, JPEG, or JPG.';
            }
        }

        // Validate bio (optional, max 120 characters)
        if (formData.bio.length > MAX_BIO_LENGTH) {
            newErrors.bio = `Bio must be at most ${MAX_BIO_LENGTH} characters`;
        }

        setErrors(newErrors);

        // If there are no errors, you can submit the form data to your server or perform other actions.
        // For this example, we will just log the data.
        if (Object.keys(newErrors).length === 0) {
            console.log('Form data:', formData);
            socket.emit('sendDataForNftIpfsMetaCreationThenReturnQrCodeForNfTokenMintTransaction', formData, async (callback) => {
                console.log("Fired inside handleSubmit socket emit")
                const nfTokenMintPayload = await callback;
                console.log("createIPFS response: ", nfTokenMintPayload);
                setMintNftPayload(nfTokenMintPayload);
                setFormOpened(false);
            });

        };
    };

    return (
        <form onSubmit={handleSubmit} className='testForm'>
            <div id="closeButtonContainer">
                <button onClick={closeForm} id="closeButton">X</button>

            </div>
            <h2>Account NFT Info:</h2>
            <div>
                <label>Username (required):</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                {errors.username && <span>{errors.username}</span>}
            </div>

            <div>
                <label>Country:</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Email (optional):</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                {errors.email && <span>{errors.email}</span>}
            </div>

            <div>
                <label>Profile Picture (PNG, JPEG, JPG, required):</label>
                <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    name="profilePicture"
                    onChange={handleFileChange}
                />
                {errors.profilePicture && <span>{errors.profilePicture}</span>}
            </div>

            <div>
                <label>Bio (optional, max 120 characters):</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleBioChange}
                    className={formData.bio.length > MAX_BIO_LENGTH ? 'error' : ''}
                />
                <br />
                {errors.bio && <span>{errors.bio}</span>}
            </div>
            <div>
                <label>Profession:</label>
                <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Profession Experience (yrs):</label>
                <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};