
"use client";
import React, { useState } from 'react';
import Modal from 'react-modal';

import './AddQuestion.css'
import { useAddQuestionToSubjectMutation, useGetQuestionsToSubjectQuery } from './../../../../../redux/features/courses/coursesApi';

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
    const [questionType, setQuestionType] = useState('text');
    const [answerType, setAnswerType] = useState('text');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [addQuestionToSubject, { isLoading: isAdding }] = useAddQuestionToSubjectMutation();
    const { data: questionsData, refetch: refetchQuestions, isFetching: isFetchingQuestions } = useGetQuestionsToSubjectQuery({
        courseId,
        yearId,
        subjectId,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addQuestionToSubject({
                courseId,
                yearId,
                subjectId,
                questionText,
                answerText,
                videoLink,
                questionImage,
                answerImage,
            }).unwrap();
            refetchQuestions(); // Fetch questions after adding a new one
            setIsFormVisible(false); // Close the modal after submitting
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleEditQuestion = (questionId: string) => {
        // Add your edit question logic here
    };

    const handleDeleteQuestion = (questionId: string) => {
        // Add your delete question logic here
    };

    const handleInsertUp = (index: number) => {
        // Add your insert up logic here
    };

    const handleInsertDown = (index: number) => {
        // Add your insert down logic here
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
            <button
                onClick={toggleFormVisibility}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
            >
                {isFormVisible ? 'Close Form' : 'Add Question'}
            </button>

            <Modal
                isOpen={isFormVisible}
                onRequestClose={toggleFormVisibility}
                contentLabel="Add Question Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">Add a Question</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question Type</label>
                            <select
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        {questionType === 'text' || questionType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                                <input
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}
                        {questionType === 'image' || questionType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setQuestionImage)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Answer Type</label>
                            <select
                                value={answerType}
                                onChange={(e) => setAnswerType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        {answerType === 'text' || answerType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Answer Text</label>
                                <input
                                    type="text"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}
                        {answerType === 'image' || answerType === 'both' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Answer Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setAnswerImage)}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                        ) : null}

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
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add Question'}
                        </button>
                    </form>
                </div>
            </Modal>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {isFetchingQuestions ? (
                    <div>Loading questions...</div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">#</th>
                                <th className="py-2">Question Text</th>
                                <th className="py-2">Question Image</th>
                                <th className="py-2">Answer Text</th>
                                <th className="py-2">Answer Image</th>
                                <th className="py-2">Video Link</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionsData?.questions.map((question, index) => (
                                <tr key={question._id}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{question.questionText}</td>
                                    <td className="border px-4 py-2">
                                        {question.questionImage?.url && (
                                            <img src={question.questionImage.url} alt="Question" className="h-16 w-16 object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">{question.answerText}</td>
                                    <td className="border px-4 py-2">
                                        {question.answerImage?.url && (
                                            <img src={question.answerImage.url} alt="Answer" className="h-16 w-16 object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {question.videoLink && (
                                            <a href={question.videoLink} target="_blank" rel="noopener noreferrer">
                                                {question.videoLink}
                                            </a>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEditQuestion(question._id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question._id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleInsertUp(index)}
                                            className="text-green-500 hover:underline"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => handleInsertDown(index)}
                                            className="text-green-500 hover:underline"
                                        >
                                            ↓
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddQuestionForm;
