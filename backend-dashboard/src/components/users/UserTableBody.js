import React from 'react';
import UserActions from './UserActions';

function UserTableBody() {
  const users = [
    {
      id: 1,
      name: "Michael A. Miner",
      avatar: "/assets/images/users/avatar-2.jpg",
      invoiceId: "#INV2540",
      status: "Completed",
      totalAmount: "$4,521",
      amountDue: "$8,901",
      dueDate: "07 Jan, 2023",
      paymentMethod: "Mastercard"
    },
    // Add more users...
  ];

  return (
    <tbody>
      {users.map(user => (
        <tr key={user.id}>
          <td>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id={`user${user.id}`} />
              <label className="form-check-label" htmlFor={`user${user.id}`}></label>
            </div>
          </td>
          <td>
            <img src={user.avatar} className="avatar-sm rounded-circle me-2" alt="" />
            {user.name}
          </td>
          <td><a href="#!" className="text-body">{user.invoiceId}</a></td>
          <td>
            <span className={`badge ${user.status === 'Completed' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} py-1 px-2`}>
              {user.status}
            </span>
          </td>
          <td>{user.totalAmount}</td>
          <td>{user.amountDue}</td>
          <td>{user.dueDate}</td>
          <td>{user.paymentMethod}</td>
          <td>
            <UserActions />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default UserTableBody;