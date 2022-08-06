import React, { useState, useTransition } from "react";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ShiftScheduleContainer,
  T_Head,
  AdminListContainer,
  TableHeader,
  Pagination,
  Shifts,
} from "./components";
import AppointmentData from "../../../components/appointment/AppointmentData";
import Logic from "../../../components/appointment/logic";
function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const { dateNtimeFormatter, sortDataByShift } = Logic({ setAppointments });
  const [currentShift, setCurrentShift] = useState("all");
  useEffect(() => {
    (async () => {
      setLoading(true);
      setAppointments([]);
      try {
        const res = await axios.get(`/api/admin/appointments/${status}`, {
          // might change later to post request
          headers: {
            userinfo: Cookies.get("userToken"),
          },
        });

        const { success, msg, results } = res.data;

        if (!success && msg.includes("session expired")) {
          return window.location.reload();
        }

        const organizedData = results.map((appointment) => {
          const { newDate, newTime } = dateNtimeFormatter(
            appointment.date_n_time
          );
          return {
            ...appointment,
            date_n_time: {
              date: newDate,
              time: newTime,
            },
          };
        });

        setAppointments(sortDataByShift(currentShift, organizedData));

        setMaxPage(Math.ceil(results.length / 10));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [status, currentShift]);

  // if (loading) return <Loader bg="rgba(0,0,0,0.5)" />;

  const fetchAppointments = appointments
    ?.slice(10 * currentPage, 10 * currentPage + 10)
    ?.map((data) => <AppointmentData key={data.id} data={data} />);

  return (
    <>
      <ShiftScheduleContainer>
        <Shifts>
          <div
            className={`${
              currentShift == "all" ? "all__shifts  active" : "all__shifts "
            }`}
            onClick={() => setCurrentShift(`all`)}
          >
            <h3>All</h3>
            <span>Schedule</span>
          </div>

          <div
            className={
              currentShift == "am" ? "all__shifts  active" : "all__shifts "
            }
            onClick={() => setCurrentShift(`am`)}
          >
            <h3>AM</h3>
            <span>Schedule</span>
          </div>
          <div
            className={
              currentShift == "pm" ? "all__shifts  active" : "all__shifts "
            }
            onClick={() => setCurrentShift(`pm`)}
          >
            <h3>PM</h3>
            <span>Schedule</span>
          </div>
        </Shifts>
        <select onChange={(e) => setStatus((prev) => e.target.value)}>
          <option value={"all"}>Select All Schedules</option>
          <option value={"pending"}> Select Pending Schedules</option>
          <option value={"approved"}> Select Approved Schedules</option>
          <option value={"onGoing"}> Select On going Schedules</option>
          <option value={"completed"}> Select Completed Schedules</option>
        </select>
      </ShiftScheduleContainer>

      <TableHeader>
        <T_Head class="table__id"># ID</T_Head>
        <T_Head class="table__customer">Customer</T_Head>
        <T_Head class="table__petname">Pet Name</T_Head>
        <T_Head class="table__date">Date</T_Head>
        <T_Head class="table__time">Time</T_Head>
        <T_Head class="table__service">Service</T_Head>
        <T_Head class="table__status">Status</T_Head>
      </TableHeader>

      <AdminListContainer>
        {loading ? (
          <h1 style={{ color: "gray", textAlign: "center", marginBlock: 20 }}>
            Loading...
          </h1>
        ) : appointments.length > 0 ? (
          fetchAppointments
        ) : (
          <h1 style={{ color: "gray", textAlign: "center", marginBlock: 20 }}>
            No appointments yet
          </h1>
        )}
      </AdminListContainer>

      <Pagination>
        <i
          class="fa-solid fa-chevron-left"
          onClick={() =>
            setCurrentPage((prev) => (prev !== 0 ? prev - 1 : prev))
          }
        ></i>{" "}
        <span>{`${currentPage + 1} / ${maxPage}`}</span>
        <i
          class="fa-solid fa-chevron-right"
          onClick={() =>
            setCurrentPage((prev) => (prev + 1 < maxPage ? prev + 1 : prev))
          }
        ></i>
      </Pagination>
    </>
  );
}

export default AppointmentList;
