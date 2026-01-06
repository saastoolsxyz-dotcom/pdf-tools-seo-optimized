
import React from 'react';

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}