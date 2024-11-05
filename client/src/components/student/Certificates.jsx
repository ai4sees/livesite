import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";

const Certificates = () => {
  const [clicked, setClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [description, setDescription] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/certificates`
        );
        setCertificates(response.data || []);
        setClicked(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };
    fetchCertificates();
  }, [userId, clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that issueDate is a valid date (YYYY format)
    if (!/^\d{4}$/.test(issueDate)) {
      toast.error("Please enter a valid date (e.g., 2024)");
      return;
    }

    // Check that description does not exceed 100 words
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      toast.error("Description should not exceed 100 words");
      return;
    }

    const certificateData = {
      title,
      issuingOrganization,
      issueDate,
      description,
    };

    try {
      if (editIndex !== null) {
        const response = await axios.put(
          `${api}/student/profile/${userId}/certificates/${editIndex}`,
          certificateData
        );
        const updatedCertificates = [...certificates];
        updatedCertificates[editIndex] = response.data;
        setCertificates(updatedCertificates);
        toast.success("Details updated");
      } else {
        const response = await axios.post(
          `${api}/student/profile/${userId}/certificates`,
          certificateData
        );
        setCertificates([...certificates, response.data]);
        toast.success("Details added");
      }

      setClicked(true);
      setTitle("");
      setIssuingOrganization("");
      setIssueDate("");
      setDescription("");
      setEditIndex(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving the certificate details:", error);
      toast.error("Failed to update details");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `${api}/student/profile/${userId}/certificates/${index}`
      );
      setCertificates(certificates.filter((_, i) => i !== index));
      toast.success("Certificate details deleted");
    } catch (error) {
      console.error("Error deleting certificate details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const cert = certificates[index];
    setIsEditing(true);
    setTitle(cert.title);
    setIssuingOrganization(cert.issuingOrganization);
    setIssueDate(cert.issueDate);
    setDescription(cert.description);
    setEditIndex(index);
  };

  return (
    <div className="container mx-auto p-4 border-b shadow-lg mt-[68px] w-full lg:w-[80%]">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Certificates (Optional)
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 flex items-center space-x-1"
        >
          <span>Add </span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Form Fields for Certificates */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Certificate Title"
            className="border p-2 mb-2 w-full"
            required
          />

          <input
            type="text"
            value={issuingOrganization}
            onChange={(e) => setIssuingOrganization(e.target.value)}
            placeholder="Issuing Organization"
            className="border p-2 mb-2 w-full"
            required
          />

          <input
            type="text"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            placeholder="Issue Date (e.g., 2024)"
            className="border p-2 mb-2 w-full"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (up to 100 words)"
            className="border p-2 mb-2 w-full"
            rows="4"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center mt-10">
          {certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <div key={index} className="border p-5 mb-2 min-w-full">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                    <div className="flex space-x-5">
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => handleEdit(index)}
                        className="hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDelete(index)}
                        className="hover:scale-125 duration-300 text-red-600 hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p>Issued by: {cert.issuingOrganization}</p>
                    <p>Issue Date: {cert.issueDate}</p>
                    <p>Description: {cert.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No certificates added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;
