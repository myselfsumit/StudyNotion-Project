import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import "video-react/dist/video-react.css";
import { useLocation } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState(courseEntireData.thumbnail);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length || !courseId || !sectionId || !subSectionId) {
      return navigate(`/dashboard/enrolled-courses`);
    }

    const filteredData = courseSectionData.find(
      (course) => course._id === sectionId
    );
    if (!filteredData) return;

    const filteredVideoData = filteredData.subSection.find(
      (data) => data._id === subSectionId
    );
    if (filteredVideoData) {
      setVideoData(filteredVideoData);
      setPreviewSource(courseEntireData.thumbnail);
      setVideoEnded(false);
    }
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    courseId,
    sectionId,
    subSectionId,
  ]);

  // Check if the lecture is the first or last video
  const isVideoEdge = (isFirst) => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    const subsections =
      courseSectionData[currentSectionIndx]?.subSection.length;

    if (isFirst) {
      return currentSectionIndx === 0 && currentSubSectionIndx === 0;
    }

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === subsections - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    const nextSubSection =
      courseSectionData[currentSectionIndx]?.subSection[
        currentSubSectionIndx + 1
      ];

    if (nextSubSection) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection._id}`
      );
    } else {
      const nextSection = courseSectionData[currentSectionIndx + 1];
      if (nextSection) {
        navigate(
          `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
        );
      }
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    const prevSubSection =
      courseSectionData[currentSectionIndx]?.subSection[
        currentSubSectionIndx - 1
      ];

    if (prevSubSection) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSection._id}`
      );
    } else {
      const prevSection = courseSectionData[currentSectionIndx - 1];
      if (prevSection) {
        const prevSubSection =
          prevSection.subSection[prevSection.subSection.length - 1];
        navigate(
          `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSection._id}`
        );
      }
    }
  };

  const handleLectureCompletion = async () => {
    try {
      setLoading(true);
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      );
      if (res) {
        dispatch(updateCompletedLectures(subSectionId));
      }
    } catch (error) {
      console.error("Error marking lecture as complete:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isVideoEdge(true) && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isVideoEdge(false) && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
