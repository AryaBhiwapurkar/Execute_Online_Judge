import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Submit() {
  const { id: problemId } = useParams();
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a * b << endl;
    return 0;
}`);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [runOutput, setRunOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [aiReview, setAiReview] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const payload = { language, code, input, problemId };

    setIsCompiling(true);
    setRunOutput('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/run`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRunOutput(response.data.output || '');
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setRunOutput('❌ Unauthorized: Please login to compile code.');
      } else {
        setRunOutput('❌ Error occurred while compiling.');
      }
    } finally {
      setIsCompiling(false);
    }
  };

  const handleFinalSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setVerdict('❌ Please login to submit.');
      return;
    }

    setIsSubmitting(true);
    setVerdict('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submit`,
        { language, code, problemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { verdict, failedTest } = response.data;
      if (verdict === 'Accepted') {
        setVerdict('✅ Verdict: Accepted');
      } else if (verdict) {
        setVerdict(`❌ Verdict: ${verdict}${failedTest ? ` on Testcase ${failedTest}` : ''}`);
      } else {
        setVerdict('❌ Unknown error occurred');
      }
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.verdict ||
        error.message;
      setVerdict(`❌ Submission error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIReview = async () => {
    setIsReviewing(true);
    setAiReview('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai-review`, {
        code,
      });
      setAiReview(res.data.review || 'No feedback received.');
    } catch (err) {
      console.error(err);
      setAiReview('❌ Failed to fetch AI review.');
    } finally {
      setIsReviewing(false);
    }
  };

  const getDefaultCode = (lang) => {
    if (lang === 'cpp') {
      return `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a * b << endl;
    return 0;
}`;
    } else if (lang === 'py') {
      return `a = int(input())
b = int(input())
print(a * b)`;
    }
    return '';
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
  };

  return (
    <div className="min-h-screen w-full" style={{
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '40px 20px',
      boxSizing: 'border-box',
    }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          ExecuteOJ Online Code Compiler
        </h1>

        {/* Language Selector */}
        <div className="mb-6 flex justify-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-300 rounded-lg py-2 px-4 bg-white shadow-sm"
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </div>

        {/* Layout: Editor Left | I/O Right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Code Editor */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-xl overflow-hidden shadow border">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold tracking-wide">
                Code Editor
              </div>
              <div className="relative" style={{ height: '600px' }}>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none border-none"
                  style={{
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    backgroundColor: '#f8f9fa',
                  }}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>

          {/* Inputs + Output + Verdict + Review */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4">
            {/* Custom Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Input:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here"
                className="w-full h-24 border border-gray-300 rounded-lg py-3 px-4 font-mono focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 shadow-sm"
              />
            </div>

            {/* Run Output */}
            <div className="bg-white rounded-xl shadow border">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                Run Output
              </div>
              <div className="p-4 min-h-[75px] bg-gray-50">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                  {runOutput || 'No output yet. Click "Compile Now" to run your code.'}
                </pre>
              </div>
            </div>

            {/* Submission Verdict (Moved above AI Review) */}
            <div className="bg-white rounded-xl shadow border">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                Submission Verdict
              </div>
              <div className="p-4 min-h-[50px] bg-gray-50">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                  {verdict || 'No verdict yet. Click "Submit Code" to see result.'}
                </pre>
              </div>
            </div>

            {/* AI Review with scroll */}
            <div className="bg-white rounded-xl shadow border">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                AI Review
              </div>
              <div className="p-4 bg-gray-50 text-gray-600 font-mono text-sm whitespace-pre-wrap"
                   style={{ minHeight: '100px', maxHeight: '300px', overflowY: 'auto' }}>
                {isReviewing
                  ? '⏳ Fetching AI feedback...'
                  : aiReview || '(AI review will appear here...)'}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={isCompiling}
            className={`text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 ${
              isCompiling ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isCompiling ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Compiling...
              </>
            ) : (
              'Compile Now'
            )}
          </button>

          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className={`text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Code'
            )}
          </button>

          <button
            onClick={handleAIReview}
            disabled={isReviewing}
            className={`text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg ${
              isReviewing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isReviewing ? 'Reviewing...' : 'AI Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Submit;
