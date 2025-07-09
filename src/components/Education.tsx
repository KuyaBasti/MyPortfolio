"use client"
import { Timeline } from "@/components/ui/Timeline"

const educationData = [
    {
        title: (
            <div className="text-center">
                <div className="text-4xl font-black">2023</div>
            </div>
        ),
        logo: "/ucdavis.png",
        logoAlt: "UC Davis",
        content: (
            <div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            <a
                                href="https://cs.ucdavis.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                                University of California, Davis
                            </a>
                        </h3>
                        <p className="text-gray-400 text-sm">September 2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white font-medium">Bachelor of Science in Computer Science and Engineering</p>
                        <p className="text-gray-300 text-sm">Davis, CA</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        <span className="text-green-400 font-medium">3.5 GPA</span> in Computer Science and Engineering Department
                        <br />
                        Expected Graduation: June 2025
                    </p>
                </div>

                <div className="expandable-content">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            • <span className="text-green-400 font-medium">Core Focus</span>: Embedded Systems, Software Development, Real-time Systems, Robotics
                        </p>
                        <p className="text-gray-300">
                            • <span className="text-blue-400 font-medium">Research Areas</span>: Autonomous Systems, Sensor Fusion, Machine Learning, Artificial Intelligence
                        </p>
                        <p className="text-gray-300">
                            • <span className="text-green-400 font-medium">Coursework</span>: Data Structures & Algorithms, Software Development (C++), Machine Learning, Artificial Intelligence, Programming on Parallel Architecture, Programming Languages, Circuit Analysis, Computer Architecture
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function Education() {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-8 text-center">
                Education
            </h2>
            <Timeline data={educationData} />
        </div>
    );
} 