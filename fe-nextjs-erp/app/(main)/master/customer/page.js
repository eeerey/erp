'import client directive jika menggunakan Next.js App Router';
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Ambil URL dari env langsung di sini
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        KODE_CUSTOMER: '',
        NAMA_CUSTOMER: '',
        ALAMAT: '',
        NO_TELP: '',
        EMAIL: '',
        STATUS: 'Aktif'
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    // 1. Fungsi GET langsung pakai axios
    const loadCustomers = async () => {
        try {
            const response = await axios.get(`${API_URL}/customers`);
            if (response.data.status === '00') {
                setCustomers(response.data.data);
            }
        } catch (err) {
            console.error('Gagal memuat data customer', err);
        }
    };

    // 2. Fungsi POST (Create) & PUT (Update) langsung
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/customers/${currentId}`, formData);
            } else {
                await axios.post(`${API_URL}/customers`, formData);
            }
            closeModal();
            loadCustomers();
        } catch (err) {
            alert(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    // 3. Fungsi DELETE langsung
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
            try {
                await axios.delete(`${API_URL}/customers/${id}`);
                loadCustomers();
            } catch (err) {
                console.error('Gagal menghapus customer', err);
            }
        }
    };

    const handleEdit = (customer) => {
        setIsEditMode(true);
        setCurrentId(customer.ID_CUSTOMER);
        setFormData({
            KODE_CUSTOMER: customer.KODE_CUSTOMER,
            NAMA_CUSTOMER: customer.NAMA_CUSTOMER,
            ALAMAT: customer.ALAMAT || '',
            NO_TELP: customer.NO_TELP || '',
            EMAIL: customer.EMAIL || '',
            STATUS: customer.STATUS || 'Aktif'
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({
            KODE_CUSTOMER: '',
            NAMA_CUSTOMER: '',
            ALAMAT: '',
            NO_TELP: '',
            EMAIL: '',
            STATUS: 'Aktif'
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Master Customer</h1>
                <button onClick={() => setIsOpenModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Tambah Customer
                </button>
            </div>

            {/* Tabel Data Customer */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                            <th className="p-3">Kode</th>
                            <th className="p-3">Nama Customer</th>
                            <th className="p-3">Alamat</th>
                            <th className="p-3">No. Telp</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {customers.length > 0 ? (
                            customers.map((cust) => (
                                <tr key={cust.ID_CUSTOMER} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium">{cust.KODE_CUSTOMER}</td>
                                    <td className="p-3">{cust.NAMA_CUSTOMER}</td>
                                    <td className="p-3">{cust.ALAMAT}</td>
                                    <td className="p-3">{cust.NO_TELP}</td>
                                    <td className="p-3">{cust.EMAIL}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${cust.STATUS === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cust.STATUS}</span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        <button onClick={() => handleEdit(cust)} className="text-yellow-600 hover:underline">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(cust.ID_CUSTOMER)} className="text-red-600 hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">
                                    Belum ada data customer.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form Tambah / Edit */}
            {isOpenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Customer' : 'Tambah Customer Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kode Customer</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.KODE_CUSTOMER}
                                    onChange={(e) => setFormData({ ...formData, KODE_CUSTOMER: e.target.value })}
                                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Customer</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.NAMA_CUSTOMER}
                                    onChange={(e) => setFormData({ ...formData, NAMA_CUSTOMER: e.target.value })}
                                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                <textarea value={formData.ALAMAT} onChange={(e) => setFormData({ ...formData, ALAMAT: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Telp</label>
                                    <input type="text" value={formData.NO_TELP} onChange={(e) => setFormData({ ...formData, NO_TELP: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={formData.EMAIL} onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select value={formData.STATUS} onChange={(e) => setFormData({ ...formData, STATUS: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Non-Aktif">Non-Aktif</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                                    Batal
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
