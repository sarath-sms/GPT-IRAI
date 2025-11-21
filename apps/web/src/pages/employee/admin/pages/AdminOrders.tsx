// src/pages/employee/admin/AdminOrders.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiHandler } from "@/utils/apiHandler";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { Printer } from "lucide-react";
import { printMiniLabel } from "@/utils/printLabel";

const Wrapper = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;

  select,
  input {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    min-width: 120px;
  }
`;

const SelectionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 235, 59, 0.4);
  font-size: 0.9rem;
`;

const AssignButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  font-size: 0.85rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.25s;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  .meta {
    font-size: 0.85rem;
    color: #bfc6dc;
  }
`;

const CardCheckbox = styled.input`
  margin-top: 4px;
  width: 18px;
  height: 18px;
`;

const CardBody = styled.div`
  flex: 1;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;

  button {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.04);
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }
`;

/* 🎨 POPUP STYLES */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 14px;
  padding: 16px 18px;
  width: 90%;
  max-width: 460px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);

  h3 {
    margin-bottom: 6px;
    color: ${({ theme }) => theme.colors.primary};
  }

  h4 {
    margin-top: 12px;
    margin-bottom: 4px;
    font-size: 0.95rem;
  }

  p {
    margin: 0;
  }
`;

const ItemsBox = styled.div`
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  max-height: 160px;
  overflow-y: auto;
  font-size: 0.88rem;

  & > div {
    margin-bottom: 4px;
  }
`;

const StatusSelect = styled.select`
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const PrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 235, 59, 0.6);
  background: rgba(255, 235, 59, 0.1);
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 8px;
`;

/* 🧑‍✈️ Driver selection modal */
const DriverList = styled.div`
  margin-top: 8px;
  max-height: 220px;
  overflow-y: auto;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  padding: 6px;
`;

const DriverRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  input {
    margin: 0;
  }

  .driver-meta {
    font-size: 0.8rem;
    color: #bfc6dc;
  }
`;

const EmptyNote = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: #bfc6dc;
`;

export default function AdminOrders() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState("pending"); // 🔹 default to pending (for assignment)
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 8;

  const [openOrder, setOpenOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("pending");

  // 🔹 selection for driver assignment
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const canSelectOrders = !!pincode; // only when a single shop pincode is selected

  useEffect(() => {
    if (!user) return;
    const loadShops = async () => {
      try {
        const data = await apiHandler.get("/api/admin/my-shops");
        setShops(data?.shops || []);
      } catch (err) {
        showToast(err, "error");
      }
    };
    loadShops();
  }, [user, showToast]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/orders?page=${page}&limit=${limit}&pincode=${pincode}&status=${status}&search=${search}`;
      const data = await apiHandler.get(url);
      setOrders(data.orders || []);
    } catch (err) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // whenever filters/page change, reload & clear selections
    setSelectedOrders([]);
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pincode, status]);

  const handleOpenOrder = (o: any) => {
    setOpenOrder(o);
    setNewStatus(o.status);
  };

  const handleUpdateStatus = async () => {
    if (!openOrder) return;
    try {
      await apiHandler.patch("/api/order/update-status", {
        orderId: openOrder._id,
        status: newStatus,
      });
      showToast("Status updated!", "success");
      setOpenOrder(null);
      loadOrders();
    } catch (err) {
      showToast(err, "error");
    }
  };

  const handlePrint = () => {
    if (!openOrder) return;
    printMiniLabel({
      user: openOrder.user,
      items:
        openOrder.items?.map((i: any) => ({
          name: i.name,
          qty: i.qty,
        })) || [],
    });
  };

  const toggleSelectOrder = (orderId: string) => {
    if (!canSelectOrders) {
      showToast("Please pick a single shop (pincode) before selecting orders", "error");
      return;
    }

    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const openAssignToDriver = async () => {
    if (!pincode) {
      showToast("Select a shop pincode first", "error");
      return;
    }
    if (selectedOrders.length === 0) {
      showToast("Select at least one order to assign", "error");
      return;
    }

    try {
      const data = await apiHandler.get(
        `/api/admin/available-drivers?pincode=${pincode}`
      );
      setAvailableDrivers(data.drivers || []);
      setSelectedDriverId("");
      setAssignModalOpen(true);
    } catch (err) {
      showToast(err, "error");
    }
  };

  const handleConfirmAssign = async () => {
    if (!selectedDriverId) {
      showToast("Please choose a driver", "error");
      return;
    }

    try {
      await apiHandler.post("/api/admin/assign-orders", {
        driverId: selectedDriverId,
        orderIds: selectedOrders,
      });
      showToast("Orders assigned to driver!", "success");
      setAssignModalOpen(false);
      setSelectedOrders([]);
      // since we change status to `out-for-delivery`, pending filter will auto drop them
      loadOrders();
    } catch (err) {
      showToast(err, "error");
    }
  };

  return (
    <Wrapper>
      <h2>📦 Orders Dashboard</h2>

      {/* Filters */}
      <Filters>
        <select value={pincode} onChange={(e) => setPincode(e.target.value)}>
          <option value="">All Shops</option>
          {shops.map((s: any) => (
            <option key={s._id} value={s.pincode}>
              {s.name} ({s.pincode})
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          placeholder="Search Order ID / Mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadOrders()}
        />
      </Filters>

      {/* Selection bar – only relevant if a single shop is chosen */}
      {canSelectOrders && (
        <SelectionBar>
          <span>
            ✅ Select orders (pincode: <b>{pincode}</b>) — Selected:{" "}
            <b>{selectedOrders.length}</b>
          </span>
          <AssignButton
            disabled={selectedOrders.length === 0}
            onClick={openAssignToDriver}
          >
            Assign to Driver
          </AssignButton>
        </SelectionBar>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((o: any) => {
          const isSelected = selectedOrders.includes(o._id);
          return (
            <Card key={o._id} onClick={() => handleOpenOrder(o)}>
              {canSelectOrders && (
                <CardCheckbox
                  type="checkbox"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelectOrder(o._id)}
                />
              )}

              <CardBody>
                <strong>🧾 {o.orderId}</strong>
                <div className="meta">
                  👤 {o.user?.name} ({o.user?.mobile})
                </div>
                <div className="meta">
                  📍 {o.shop?.name} ({o.pincode})
                </div>
                <div className="meta">⏱ {o.deliverySlot}</div>
                <div className="meta">💰 ₹{o.total}</div>
                <div className="meta">
                  📦 Status: <b style={{ color: "#FFEB3B" }}>{o.status}</b>
                </div>
              </CardBody>
            </Card>
          );
        })
      )}

      <Pagination>
        <button onClick={() => page > 1 && setPage(page - 1)}>⬅ Prev</button>
        <button onClick={() => setPage(page + 1)}>Next ➡</button>
      </Pagination>

      {/* 🧾 ORDER DETAILS POPUP */}
      {openOrder && (
        <Overlay>
          <ModalBox>
            <h3>🧾 {openOrder.orderId}</h3>
            <p>
              <b>👤 {openOrder.user?.name}</b> ({openOrder.user?.mobile})
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: 4 }}>
              📍 {openOrder.address?.houseId}, {openOrder.address?.addr1},{" "}
              {openOrder.address?.addr2}
            </p>

            <PrintButton onClick={handlePrint}>
              <Printer size={16} /> Print 40×30mm Label
            </PrintButton>

            <h4>🛒 Items</h4>
            <ItemsBox>
              {openOrder.items.map((i: any) => (
                <div key={i.product}>
                  {i.name} × {i.qty}
                </div>
              ))}
            </ItemsBox>

            <h4>📦 Status</h4>
            <StatusSelect
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </StatusSelect>

            <ModalActions>
              <PrimaryButton onClick={handleUpdateStatus}>
                Update Status
              </PrimaryButton>
              <SecondaryButton onClick={() => setOpenOrder(null)}>
                Close
              </SecondaryButton>
            </ModalActions>
          </ModalBox>
        </Overlay>
      )}

      {/* 🧑‍✈️ DRIVER ASSIGN POPUP */}
      {assignModalOpen && (
        <Overlay>
          <ModalBox>
            <h3>🚚 Assign to Driver</h3>
            <p style={{ fontSize: "0.9rem" }}>
              Pincode: <b>{pincode}</b> · Selected orders:{" "}
              <b>{selectedOrders.length}</b>
            </p>

            {availableDrivers.length === 0 ? (
              <EmptyNote>
                No available drivers for this pincode right now (or all are
                carrying 5+ active orders).
              </EmptyNote>
            ) : (
              <>
                <h4>Choose Driver</h4>
                <DriverList>
                  {availableDrivers.map((d: any) => (
                    <DriverRow key={d._id}>
                      <input
                        type="radio"
                        name="driver"
                        value={d._id}
                        checked={selectedDriverId === d._id}
                        onChange={() => setSelectedDriverId(d._id)}
                      />
                      <div>
                        <div>
                          {d.name} ({d.mobile})
                        </div>
                        {"activeOrders" in d && (
                          <div className="driver-meta">
                            Active Orders: {d.activeOrders}
                          </div>
                        )}
                      </div>
                    </DriverRow>
                  ))}
                </DriverList>
              </>
            )}

            <ModalActions>
              <PrimaryButton
                onClick={handleConfirmAssign}
                disabled={!selectedDriverId || availableDrivers.length === 0}
              >
                Confirm Assign
              </PrimaryButton>
              <SecondaryButton onClick={() => setAssignModalOpen(false)}>
                Cancel
              </SecondaryButton>
            </ModalActions>
          </ModalBox>
        </Overlay>
      )}
    </Wrapper>
  );
}
