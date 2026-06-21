import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

function AttendanceDetails() {
    const { id } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/attendance/details/${id}`);
            setData(res.data);
            console.log(res.data);
        } catch (error) {
            console.log("Error fetching attendance details:", error);
        } finally {
            setLoading(false);
        }
    };
    const formatTime = (time) => {
    if (!time) return "-";

    const [hour, minute] = time.split(":");

    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
};

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">
                Attendance Details (Employee #{id})
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="p-2">Date</th>
                            <th className="p-2">Check In</th>
                            <th className="p-2">Check Out</th>
                             <th className="p-2">Duration</th>
                            <th className="p-2">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2">{item.date}</td>
                                   <td>{formatTime(item.check_in)}</td>
                                   <td>{formatTime(item.check_out)}</td>
                                   <td className="p-2">{item.duration}</td>
                                    <td className="p-2">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">
                                    No attendance found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AttendanceDetails;