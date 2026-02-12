import React from 'react';
import { Button } from './Button';

interface PageHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export const PageHeader = ({ title, actionButton, children }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4 pb-3 border-b">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="flex items-center gap-2">
        {children}
        {actionButton && (
          <Button onClick={actionButton.onClick}>
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
};

