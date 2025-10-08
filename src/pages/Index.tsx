import React from "react";
// This page is no longer directly used as the root route now renders MainLayout
// and its default child, Dashboard.
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Application...</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          If you see this, there might be a routing issue.
        </p>
      </div>
    </div>
  );
};

export default Index;