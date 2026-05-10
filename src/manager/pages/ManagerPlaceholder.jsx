import React from 'react';
import Card from '../../components/Card'; // Assuming Card exists
import { Settings, Users, Package, FileText, Clock, FileBarChart } from 'lucide-react';

export default function ManagerPlaceholder({ title, description, icon: Icon }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-[#3E2723]">{title}</h1>
        <p className="mt-1 text-base text-[#8B6F47]">{description}</p>
      </section>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e7d5c3] p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 bg-[#F5E6D3] text-[#D4853D] rounded-full flex items-center justify-center">
          <Icon size={32} />
        </div>
        <h2 className="text-xl font-medium text-[#3E2723]">Coming Soon</h2>
        <p className="text-[#8B6F47] max-w-md">
          The {title} module is currently under active development. This feature will be available in an upcoming release.
        </p>
      </div>
    </div>
  );
}
