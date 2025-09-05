import React from "react";
import { useParams } from "react-router-dom";
import { FiSearch, FiSliders } from "react-icons/fi";

const Projects = () => {
  const { projectId } = useParams();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project {projectId ? projectId : ""}</h1>
        <div className="">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 mb-8 bg-gray-500 text-white rounded-lg">
        <h2 className="text-xl font-bold text-white">Good Morning Eric Joe.</h2>
        <p className="text-white">
          Let's get your research moving. Craft better surveys, find the right participants, and
          make informed decisions powered by real African data.
        </p>
      </div>

      <div className="p-10 border-2 border-dashed border-gray-300 rounded-lg bg-white">
        <h3 className="text-center text-gray-500">
          {projectId
            ? `Details for Project ID: ${projectId} will be shown here.`
            : "You currently have no surveys in this project. Click on “Create Survey” to get started."}
        </h3>
      </div>
    </div>
  );
};

export default Projects;
