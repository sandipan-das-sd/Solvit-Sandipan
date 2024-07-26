"use client"
import React, { useState } from 'react';
import axios from 'axios';

interface AddQuestionFormProps {
    courseId: string;
    yearId: string;
    subjectId: string;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ courseId, yearId, subjectId }) => {
    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [answerImage, setAnswerImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('questionText', questionText);
        formData.append('answerText', answerText);
        formData.append('videoLink', videoLink);

        if (questionImage) formData.append('questionImage', questionImage);
        if (answerImage) formData.append('answerImage', answerImage);

        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/course/${courseId}/year/${yearId}/subject/${subjectId}/question`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Question added:', response.data);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Add a Question</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Question Text</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Question Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setQuestionImage)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Answer Text</label>
                    <input
                        type="text"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Answer Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setAnswerImage)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Video Link</label>
                    <input
                        type="text"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Question
                </button>
            </form>
        </div>
    );
};

export default AddQuestionForm;
