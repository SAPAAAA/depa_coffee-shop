import { useState, useEffect } from 'react';
// LƯU Ý 1: Đường dẫn import này có thể cần chỉnh lại số lượng dấu "../" cho đúng với cấu trúc thư mục của bạn
import { httpClient } from '../../../../utils/httpClient';

// Dựa theo OrderStatusSchema từ Backend
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface OrderItem {
    id: string;
    drinkName?: string;
    variantName?: string;
    name?: string; // API của Tú có thể trả về tên món hoặc chỉ trả về drinkVariantId
    quantity: number;
    sugarLevel: string;
    iceLevel: string;
    toppings?: OrderItemTopping[];
}

interface Order {
    id: string;
    status: OrderStatus;
    orderDate: string;
    items: OrderItem[];
}

interface OrderItemTopping {
    orderItemId: string;
    toppingId: string;
    quantity: number;
    toppingName?: string; // Tên topping lấy từ database
}

export default function BaristaBoard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // GỌI API LẤY DANH SÁCH ĐƠN HÀNG KHI MỞ TRANG
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await httpClient.get<any>('/api/orders');
            const ordersArray = response?.orders || response?.data?.orders || response?.data?.data?.orders || [];

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // GỌI API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await httpClient.patch(`/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái đơn hàng!");
        }
    };


    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status);
    };

    const OrderCard = ({ order }: { order: Order }) => (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
                <span className="font-bold text-lg text-blue-600">#{order.id.split('-')[0]}</span>
                <span className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            <div className="space-y-2 mb-4">
                {order.items?.map(item => (
                    <div key={item.id} className="text-sm">
                        <span className="font-semibold">{item.quantity}x {item.drinkName || 'Món uống'} ({item.variantName || "Size"})</span>
                        <div className="text-gray-500 text-xs ml-4">
                            Đường: {item.sugarLevel} | Đá: {item.iceLevel}
                        </div>

                        {item.toppings && item.toppings.length > 0 && (
                            <div className="text-blue-600 text-xs ml-4 font-medium">
                                + Topping: {item.toppings.map(t => `${t.quantity}x ${t.toppingName}`).join(", ")}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                {order.status === 'pending' && (
                    <button
                        onClick={() => handleUpdateStatus(order.id, 'processing')}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded shadow-sm transition-colors cursor-pointer"
                    >
                        Nhận đơn & Pha chế
                    </button>
                )}

                {order.status === 'processing' && (
                    <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded shadow-sm transition-colors cursor-pointer"
                    >
                        Pha chế xong
                    </button>
                )}

                {order.status === 'completed' && (
                    <button
                        disabled
                        className="w-full py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded cursor-not-allowed"
                    >
                        Đã hoàn thành
                    </button>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu từ server...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Bảng Điều Khiển Barista</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 min-h-[500px]">
                    <h2 className="font-bold text-red-700 mb-4 flex justify-between items-center bg-red-100 p-2 rounded-lg">
                        CHỜ XỬ LÝ
                        <span className="bg-white text-red-800 py-1 px-3 rounded-full text-xs font-black shadow-sm">
                            {getOrdersByStatus('pending').length}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {getOrdersByStatus('pending').map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                </div>

                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 min-h-[500px]">
                    <h2 className="font-bold text-yellow-700 mb-4 flex justify-between items-center bg-yellow-100 p-2 rounded-lg">
                        ĐANG PHA CHẾ
                        <span className="bg-white text-yellow-800 py-1 px-3 rounded-full text-xs font-black shadow-sm">
                            {getOrdersByStatus('processing').length}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {getOrdersByStatus('processing').map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                </div>

                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 min-h-[500px]">
                    <h2 className="font-bold text-green-700 mb-4 flex justify-between items-center bg-green-100 p-2 rounded-lg">
                        HOÀN THÀNH
                        <span className="bg-white text-green-800 py-1 px-3 rounded-full text-xs font-black shadow-sm">
                            {getOrdersByStatus('completed').length}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {getOrdersByStatus('completed').map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                </div>

            </div>
        </div>
    );
}