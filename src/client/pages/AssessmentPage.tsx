import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReligiousTraumaAssessment from './assessments/ReligiousTraumaAssessment';
import DeconstructionStageFinder from './assessments/DeconstructionStageFinder';
import PostFaithIdentityQuiz from './assessments/PostFaithIdentityQuiz';

export function AssessmentPage() {
  const { slug } = useParams<{ slug: string }>();

  switch (slug) {
    case 'religious-trauma-assessment':
      return <ReligiousTraumaAssessment />;
    case 'deconstruction-stage-finder':
      return <DeconstructionStageFinder />;
    case 'post-faith-identity-quiz':
      return <PostFaithIdentityQuiz />;
    default:
      return <Navigate to="/assessments" replace />;
  }
}
