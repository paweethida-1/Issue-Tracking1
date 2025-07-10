// React.jsx สำหรับหน้า Admin และ Staff
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'ADMIN' || user.role === 'ADMIN_STAFF') {
          const res = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setUsers(res.data);
        }

        const reqUrl =
          user.role === 'STAFF'
            ? `${API_URL}/assigned`
            : `${API_URL}/request`;
        const requestRes = await axios.get(reqUrl, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRequests(requestRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      {user.role === 'ADMIN' || user.role === 'ADMIN_STAFF' ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">ผู้ใช้งานทั้งหมด</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent>
                  <p>ชื่อ: {u.name}</p>
                  <p>อีเมล: {u.email}</p>
                  <p>บทบาท: {u.role}</p>
                  <Button
                    onClick={() => handleDeleteUser(u.id)}
                    className="mt-2 bg-red-500 hover:bg-red-600"
                  >
                    ลบผู้ใช้
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-xl font-semibold mb-2">รายการคำร้อง</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent>
                <p>เรื่อง: {r.title}</p>
                <p>แผนก: {r.department}</p>
                <p>สถานะ: {r.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
