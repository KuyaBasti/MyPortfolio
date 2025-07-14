"use client"
import { Timeline } from "@/components/ui/Timeline"

const workData = [
    {
        title: (
            <div className="text-center">
                <div className="text-4xl font-black">2025</div>
            </div>
        ),
        logo: "/corelab.png",
        logoAlt: "CORE Lab",
        content: (
            <div>
                {/* Always visible: Company, Position, Dates, Location */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            <a
                                href="https://nazarilab.ucdavis.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                                Davis Autonomous Race Car (DARC)
                            </a>
                        </h3>
                        <p className="text-gray-400 text-sm">January 2025</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white font-medium">Software/Robotics Engineer</p>
                        <p className="text-gray-300 text-sm">Davis, CA</p>
                    </div>
                </div>

                {/* Main descriptor */}
                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        Developing autonomous systems under <span className="text-blue-400 font-medium">Prof. Shima Nazari&apos;s CORE Lab</span>, focused on F1Tenth racing competition
                    </p>
                </div>

                {/* Expandable content - hidden by default */}
                <div className="expandable-content">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            • Enhanced real-time navigation using <span className="text-green-400 font-medium">ROS2 (Foxy Fitzroy)</span> on Nvidia Jetson Xavier NX
                        </p>
                        <p className="text-gray-300">
                            • Integrated <span className="text-green-400 font-medium">LangSAM and TinySAM</span> with Intel RealSense D435 for improved obstacle detection
                        </p>
                        <p className="text-gray-300">
                            • Designed computer vision pipelines for dynamic obstacle detection, reducing navigation errors
                        </p>
                        <p className="text-gray-300">
                            • Implemented multi-sensor fusion with <span className="text-green-400 font-medium">LiDAR and depth camera</span> data
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: (
            <div className="text-center">
                <div className="text-4xl font-black">2023</div>
            </div>
        ),
        logo: "/sss.png",
        logoAlt: "Space and Satellite Systems",
        content: (
            <div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            <a
                                href="https://www.nasa.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                                Space and Satellite Systems
                            </a>
                        </h3>
                        <p className="text-gray-400 text-sm">September 2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white font-medium">Embedded/Software Engineer</p>
                        <p className="text-gray-300 text-sm">Davis, CA</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        Contributed to <span className="text-blue-400 font-medium">NASA-affiliated CubeSatellite project</span>, focusing on space-ready embedded systems
                    </p>
                </div>

                <div className="expandable-content">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            • Developed <span className="text-green-400 font-medium">Flight Software</span> portion of the Satellite with custom RTOS
                        </p>
                        <p className="text-gray-300">
                            • Implemented <span className="text-blue-400 font-medium">SPI, I2C, and UART protocols</span> for IMU sensors
                        </p>
                        <p className="text-gray-300">
                            • Deployed custom drivers on <span className="text-green-400 font-medium">STM32 microcontroller</span> for low-latency sensor communication
                        </p>
                        <p className="text-gray-300">
                            • Designed logger timer with <span className="text-green-400 font-medium">microsecond level synchronization</span>
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: (
            <div className="text-center">
                <div className="text-4xl font-black">2023</div>
            </div>
        ),
        logo: "/yubacollege.png",
        logoAlt: "Yuba College",
        content: (
            <div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            <a
                                href="https://yc.yccd.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                                Yuba College
                            </a>
                        </h3>
                        <p className="text-gray-400 text-sm">January 2023</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white font-medium">Software/Robotics Engineer</p>
                        <p className="text-gray-300 text-sm">Marysville, CA</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        Collaborated in <span className="text-blue-400 font-medium">Prof. Douglas Joksch&apos;s lab</span> to develop kinematic robotic arm for automated motion control
                    </p>
                </div>

                <div className="expandable-content">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            • Designed robotic arm controller in <span className="text-green-400 font-medium">C++ with embedded assembly</span>
                        </p>
                        <p className="text-gray-300">
                            • Implemented performance-critical <span className="text-blue-400 font-medium">G-Code parsing and execution</span>
                        </p>
                        <p className="text-gray-300">
                            • Converted G-Code into 2D (X, Y) coordinate paths with Excel-based plotting verification
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: (
            <div className="text-center">
                <div className="text-4xl font-black">2022</div>
            </div>
        ),
        logo: "/yubacollege.png",
        logoAlt: "Yuba College",
        content: (
            <div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            <a
                                href="https://yc.yccd.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                                Yuba College
                            </a>
                        </h3>
                        <p className="text-gray-400 text-sm">January 2022</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white font-medium">Student Tutor</p>
                        <p className="text-gray-300 text-sm">Marysville, CA</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                        Tutored students in <span className="text-blue-400 font-medium">advanced mathematics and engineering</span> courses
                    </p>
                </div>

                <div className="expandable-content">
                    <div className="space-y-2">
                        <p className="text-gray-300">
                            • <span className="text-green-400 font-medium">Mathematics</span>: Calculus 1, 2, 3, Differential Equations, Linear Algebra
                        </p>
                        <p className="text-gray-300">
                            • <span className="text-blue-400 font-medium">Physics</span>: Classical Mechanics, Electromagnetism
                        </p>
                        <p className="text-gray-300">
                            • <span className="text-green-400 font-medium">Computer Science</span>: Data Structures and Algorithms, C++
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function Work() {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-8 text-center">
                Work Experience
            </h2>
            <Timeline data={workData} />
        </div>
    );
} 