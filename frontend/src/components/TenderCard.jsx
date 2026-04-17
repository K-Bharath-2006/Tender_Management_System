import React from 'react';
import { Link } from 'react-router-dom';
import { BiRupee, BiCalendar, BiMap, BiBuilding, BiTime } from 'react-icons/bi';

const TenderCard = ({ tender }) => {
    const isClosed = tender.status === 'Closed';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary-100">
                            ID: {tender.id}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isClosed ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {tender.status}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                    {tender.title}
                </h3>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                        <BiBuilding className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{tender.department}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                        <BiMap className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{tender.location}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><BiRupee /> Budget</p>
                        <p className="font-semibold text-slate-800">{tender.budget}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><BiCalendar /> Deadline</p>
                        <p className="font-semibold text-slate-800">{new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="pt-4 mt-2">
                    <Link
                        to={`/tender-details/${tender.id}`}
                        className="w-full block text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg border border-slate-200 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TenderCard;
