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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Master Customer</h1>
                <button onClick={() => setIsOpenModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
                    + Tambah Customer
                </button>
            </div>

            {/* Tabel Data Customer */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold">Kode</th>
                                <th className="p-4 font-semibold">Nama Customer</th>
                                <th className="p-4 font-semibold">Alamat</th>
                                <th className="p-4 font-semibold">No. Telp</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {customers.length > 0 ? (
                                customers.map((cust) => (
                                    <tr key={cust.ID_CUSTOMER} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-900">{cust.KODE_CUSTOMER}</td>
                                        <td className="p-4 text-gray-800">{cust.NAMA_CUSTOMER}</td>
                                        <td className="p-4 text-gray-600">{cust.ALAMAT || '-'}</td>
                                        <td className="p-4 text-gray-600">{cust.NO_TELP || '-'}</td>
                                        <td className="p-4 text-gray-600">{cust.EMAIL || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cust.STATUS === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cust.STATUS}</span>
                                        </td>
                                        <td className="p-4 text-center space-x-3">
                                            <button onClick={() => handleEdit(cust)} className="text-yellow-600 hover:text-yellow-700 font-medium transition">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(cust.ID_CUSTOMER)} className="text-red-600 hover:text-red-700 font-medium transition">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        Belum ada data customer.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form Tambah / Edit */}
            {isOpenModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 transform transition-all">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{isEditMode ? 'Edit Customer' : 'Tambah Customer Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.KODE_CUSTOMER}
                                    onChange={(e) => setFormData({ ...formData, KODE_CUSTOMER: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.NAMA_CUSTOMER}
                                    onChange={(e) => setFormData({ ...formData, NAMA_CUSTOMER: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <textarea
                                    value={formData.ALAMAT}
                                    onChange={(e) => setFormData({ ...formData, ALAMAT: e.target.value })}
                                    rows="2"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telp</label>
                                    <input
                                        type="text"
                                        value={formData.NO_TELP}
                                        onChange={(e) => setFormData({ ...formData, NO_TELP: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.EMAIL}
                                        onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.STATUS}
                                    onChange={(e) => setFormData({ ...formData, STATUS: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Non-Aktif">Non-Aktif</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                                    Batal
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm">
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
