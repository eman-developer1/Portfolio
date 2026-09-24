'use client';

import React, { useState, useEffect } from 'react';
import { Assignment } from '@/types';

import { assignments as initialAssignments } from '@/data/assignments';
import { AssignmentCard } from './AssignmentCard';
import { BookMarked } from 'lucide-react';
import styles from './Assignments.module.css';

export const Assignments: React.FC = () => {
  const [assignmentList, setAssignmentList] = useState<Assignment[]>(initialAssignments);
  const [loading, setLoading] = useState(true);



  return (
    <section id="assignments" className={`section ${styles.assignmentsSection}`}>
      <div className="container">
        {/* Section Header */}
        <div className="sectionHeader">
          {/* <span className="sectionPill">
            <BookMarked size={14} />
            <span>Academic &amp; Practical Labs</span>
          </span> */}
          <h2 className="sectionTitle">Assignments &amp; Projects</h2>
          <p className="sectionSubtitle">
            Curated coursework, engineering assignments, and hands-on laboratory implementations with accessible code and documentation.
          </p>
        </div>

        {/* Assignments Grid */}
        <div className={styles.assignmentsGrid}>
          {assignmentList.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
    </section>
  );
};
