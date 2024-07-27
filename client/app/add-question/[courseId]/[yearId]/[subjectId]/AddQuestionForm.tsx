
"use client";
import React, { useState, useEffect } from 'react';
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
                    disabled={isAdding}
                >
                    {isAdding ? 'Adding...' : 'Add Question'}
                </button>
            </form>
            {isAdding && <div>Loading...</div>}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {isFetchingQuestions ? (
                    <div>Loading questions...</div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Question Text</th>
                                <th className="py-2">Question Image</th>
                                <th className="py-2">Answer Text</th>
                                <th className="py-2">Answer Image</th>
                                <th className="py-2">Video Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionsData?.questions.map((question) => (
                                <tr key={question._id}>
                                    <td className="border px-4 py-2">{question.questionText}</td>
                                    <td className="border px-4 py-2">
                                        {question.questionImage?.url && (
                                            <img src={question.questionImage.url} alt="Question" className="h-10 w-10 object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">{question.answerText}</td>
                                    <td className="border px-4 py-2">
                                        {question.answerImage?.url && (
                                            <img src={question.answerImage.url} alt="Answer" className="h-10 w-10 object-cover" />
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {question.videoLink && (
                                            <a href={question.videoLink} target="_blank" rel="noopener noreferrer">
                                                {question.videoLink}
                                            </a>
                                        )}
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
