"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Pencil, Plus, Minus, Search, Star, Lock, Settings2, X } from "lucide-react";

const CATEGORY_OPTIONS = ["全部", "荤", "素", "汤", "主食", "小吃"];
const RECOMMENDED_DISH_NAMES = ["红烧肉", "葱油面"];

const initialDishes = [
  {
    id: 1,
    name: "红烧肉",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    shortDesc: "肥而不腻，酱香浓郁，适合配米饭。",
    highlights: ["慢火收汁", "层次分明", "招牌推荐"],
    recipe: "五花肉 500g｜冰糖 25g｜生抽 3勺｜老抽 1勺｜料酒 2勺｜姜片适量｜八角 2个",
    method:
      "1. 五花肉切块焯水。2. 冰糖炒糖色，下肉翻炒。3. 加入调料和热水，小火慢炖 45-60 分钟。4. 大火收汁。",
    price: "$18",
    spice: "不辣",
    categories: ["荤"],
  },
  {
    id: 2,
    name: "葱油面",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1200&auto=format&fit=crop",
    shortDesc: "葱香扑鼻，面条劲道，酱香带一点回甘。",
    highlights: ["秘制酱油", "手撕瑶柱丝", "经典快手"],
    recipe: "细面 1份｜小葱 1把｜生抽 3勺｜老抽 1勺｜糖 1勺｜油适量｜瑶柱丝少许",
    method:
      "1. 小葱炸至金黄。2. 调酱汁。3. 面煮熟后拌入葱油和酱汁。4. 最后撒瑶柱丝。",
    price: "$12",
    spice: "微咸鲜香",
    categories: ["主食"],
  },
  {
    id: 3,
    name: "口水鸡",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
    shortDesc: "麻辣鲜香，鸡肉嫩滑，层次感很强。",
    highlights: ["嫩滑鸡腿肉", "自制红油", "开胃凉菜"],
    recipe: "鸡腿 2只｜花椒油｜辣椒油｜蒜末｜芝麻｜酱油｜醋｜糖",
    method:
      "1. 鸡腿煮熟冰镇。2. 切块摆盘。3. 调麻辣料汁。4. 淋汁后撒芝麻与葱花。",
    price: "$16",
    spice: "中辣",
    categories: ["荤", "小吃"],
  },
];

function DishEditor({ dish, onSave }) {
  const [form, setForm] = useState({
    ...dish,
    categories: dish.categories || [],
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...(prev.categories || []), category],
    }));
  };

  return (
    <div className="grid gap-3">
      <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="菜名" />
      <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="图片链接" />
      <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="价格" />
      <Input value={form.shortDesc} onChange={(e) => update("shortDesc", e.target.value)} placeholder="简短描述" />
      <Input
        value={form.highlights.join("、")}
        onChange={(e) => update("highlights", e.target.value.split("、").filter(Boolean))}
        placeholder="亮点，用 、 分隔"
      />
      <div className="grid gap-2">
        <div className="text-sm font-medium text-[#4f3928]">分类标签（可多选）</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.filter((item) => item !== "全部").map((item) => {
            const active = form.categories?.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-[#8d5f3d] bg-[#e8d2ba] text-[#4f3928]" : "border-[#d7c3a3] bg-[#fffaf4] text-[#7b6856]"}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <Input value={form.recipe} onChange={(e) => update("recipe", e.target.value)} placeholder="配方" />
      <Textarea value={form.method} onChange={(e) => update("method", e.target.value)} placeholder="做法" className="min-h-28" />
      <Button onClick={() => onSave(form)} className="rounded-2xl">保存修改</Button>
    </div>
  );
}

export default function RecipeOrderingSitePrototype() {
  const [dishes, setDishes] = useState(initialDishes);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [notes, setNotes] = useState("");
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1800&auto=format&fit=crop");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartButtonPos, setCartButtonPos] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 18 });
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [categoryPointer, setCategoryPointer] = useState({ x: 0, y: 0, active: false });
  const [submitFeedback, setSubmitFeedback] = useState("");
  const [editingDish, setEditingDish] = useState(null);

  const ADMIN_PASSWORD = "159753";

  useEffect(() => {
    if (!adminError) return;
    const timer = window.setTimeout(() => setAdminError(""), 2000);
    return () => window.clearTimeout(timer);
  }, [adminError]);

  useEffect(() => {
    if (!submitFeedback) return;
    const timer = window.setTimeout(() => setSubmitFeedback(""), 3000);
    return () => window.clearTimeout(timer);
  }, [submitFeedback]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return dishes.filter((d) => {
      const matchesKeyword = !keyword ||
        d.name.toLowerCase().includes(keyword) ||
        d.shortDesc.toLowerCase().includes(keyword) ||
        d.highlights.join(" ").toLowerCase().includes(keyword);
      const matchesCategory = selectedCategory === "全部" || (d.categories || []).includes(selectedCategory);
      const matchesRecommended = !showRecommendedOnly || RECOMMENDED_DISH_NAMES.includes(d.name);
      return matchesKeyword && matchesCategory && matchesRecommended;
    });
  }, [search, dishes, selectedCategory, showRecommendedOnly]);

  const addToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const removeFromCart = (dishId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dishId);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((item) => item.id !== dishId);
      }
      return prev.map((item) =>
        item.id === dishId ? { ...item, qty: item.qty - 1 } : item
      );
    });
  };

  const getDishQty = (dishId) => cart.find((item) => item.id === dishId)?.qty || 0;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + numericPrice * item.qty;
  }, 0);

  const submitOrderIntent = async () => {
    const orderLines = cart.length
      ? cart.map((item) => `- ${item.name} x${item.qty} (${item.price})`).join("\n")
      : "- 暂无菜品";

    const plainText = [
      "你好，这是一个新的点单意向：",
      "",
      `姓名：${friendName || "未填写"}`,
      "",
      "菜品：",
      orderLines,
      "",
      `备注：${notes || "无"}`,
    ].join("\n");

    const subject = encodeURIComponent(`大V子私房菜点单意向｜${friendName || "未填写姓名"}`);
    const body = encodeURIComponent(plainText);
    const mailtoUrl = `mailto:vitoww627@gmail.com?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
      setSubmitFeedback("已尝试打开邮件客户端。");
    } catch (error) {
      // ignore and fallback below
    }

    try {
      await navigator.clipboard.writeText(plainText);
      setSubmitFeedback("预览环境可能拦截了发信，订单内容已复制到剪贴板。");
    } catch (error) {
      setSubmitFeedback("预览环境可能拦截了发信，请复制内容手动发送到 vitoww627@gmail.com。");
    }
  };

  const unlockAdmin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminError("");
      setAdminPasswordInput("");
      return;
    }
    setAdminError("黑入失败");
  };

  const lockAdmin = () => {
    setIsAdmin(false);
    setAdminError("");
    setAdminPasswordInput("");
  };

  const saveDish = (updatedDish) => {
    const normalized = { ...updatedDish, categories: updatedDish.categories || [] };
    setDishes((prev) => prev.map((d) => (d.id === normalized.id ? normalized : d)));
    if (selectedDish?.id === normalized.id) setSelectedDish(normalized);
    setEditingDish(null);
  };

  const addNewDish = () => {
    const newDish = {
      id: Date.now(),
      name: "新菜品",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      shortDesc: "在这里写一句吸引人的描述。",
      highlights: ["新鲜现做", "可自行修改"],
      recipe: "在这里填写配方",
      method: "在这里填写做法步骤",
      price: "$0",
      spice: "可调整",
      categories: ["小吃"],
    };
    setDishes((prev) => [newDish, ...prev]);
    setEditingDish(newDish);
  };

  const startDrag = (clientX, clientY) => {
    setDragging(false);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      startX: cartButtonPos.x,
      startY: cartButtonPos.y,
    };
  };

  const onDragMove = (clientX, clientY) => {
    const dx = dragStartRef.current.x - clientX;
    const dy = dragStartRef.current.y - clientY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setDragging(true);
    }
    setCartButtonPos({
      x: Math.max(12, dragStartRef.current.startX + dx),
      y: Math.max(12, dragStartRef.current.startY + dy),
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);

    const handleMove = (moveEvent) => onDragMove(moveEvent.clientX, moveEvent.clientY);
    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      setTimeout(() => setDragging(false), 50);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    onDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setDragging(false), 50);
  };

  const updateLightFromPointer = (clientX, clientY) => {
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setLightPos({ x, y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => updateLightFromPointer(e.clientX, e.clientY);
    const handleTouchMoveGlobal = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      updateLightFromPointer(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMoveGlobal, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMoveGlobal);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1b1511] text-stone-700">
      <style>{`
        @keyframes categoryTrailIn {
          0% {
            opacity: 0;
            transform: translate(0px, 0px) scale(0.72);
            filter: blur(6px);
          }
          65% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 1.04), calc(var(--ty) * 1.04)) scale(1.03);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translate(var(--tx), var(--ty)) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

      <div className={`mx-auto max-w-[1480px] px-4 py-0 transition duration-300 md:px-8 ${selectedDish ? "blur-md scale-[0.99]" : ""}`}>
        <div className="relative -mx-4 overflow-hidden md:-mx-8">
          <div
            className="relative px-6 py-10 md:px-10 md:py-14"
            style={{
              backgroundImage: `linear-gradient(rgba(18,10,8,0.56), rgba(18,10,8,0.56)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative">
              <div className="relative inline-flex flex-col items-start">
                <h1
                  className="relative flex items-baseline justify-start whitespace-nowrap text-[64px] font-black tracking-[0.04em] text-[#fff4df] md:text-[104px]"
                  style={{
                    fontFamily: '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
                    WebkitTextStroke: "1px rgba(255,210,160,0.18)",
                    textShadow:
                      "0 0 3px rgba(255,248,236,0.98), 0 0 12px rgba(255,220,160,0.90), 0 0 28px rgba(255,170,100,0.66), 0 0 56px rgba(255,126,70,0.40), 0 0 96px rgba(255,110,48,0.20), 0 2px 0 rgba(60,28,18,0.18)",
                  }}
                >
                  <span>大</span>
                  <span className="text-[1.42em] leading-[0.9] translate-y-[0.02em]">V</span>
                  <span>子私房菜</span>
                </h1>
                <div className="relative mt-3 pl-1 text-[16px] tracking-[0.18em] text-[rgba(255,245,230,0.96)] md:text-[18px]">
                  <span>在这里没有花里胡哨，只有实打实的好味道</span>
                  <span
                    className="pointer-events-none absolute left-0 top-full mt-1 origin-top-left skew-x-[-18deg] scale-y-[-1] opacity-30 blur-[1.2px]"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.12) 68%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.12) 68%, transparent 100%)'
                    }}
                    aria-hidden="true"
                  >
                    在这里没有花里胡哨，只有实打实的好味道
                  </span>
                </div>
              </div>

              {isAdmin ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    className="rounded-full bg-[#5f4330] px-5 text-[#fbf6ef] hover:bg-[#4e3627]"
                    onClick={addNewDish}
                  >
                    <Plus className="mr-2 h-4 w-4" /> 添加新菜
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-[#d8c7aa] bg-[rgba(255,248,238,0.78)] px-5 text-[#5f4330] hover:bg-[#f3e8d8] hover:text-[#5c3f2a]"
                    onClick={lockAdmin}
                  >
                    <Lock className="mr-2 h-4 w-4" /> 退出管理
                  </Button>
                </div>
              ) : null}

              {isAdmin ? (
                <div className="absolute bottom-0 right-0 rounded-[22px] border border-[rgba(255,248,238,0.35)] bg-[rgba(255,248,238,0.18)] p-3 shadow-[0_10px_25px_rgba(38,28,20,0.12)] backdrop-blur-md">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#fff8ef]">
                    <Settings2 className="h-4 w-4" /> 背景设置
                  </div>
                  <Input
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="粘贴顶部背景图链接"
                    className="h-10 w-[240px] border-[rgba(255,248,238,0.35)] bg-[rgba(255,248,238,0.55)] text-[#5f4330] placeholder:text-[#8b735d]"
                  />
                </div>
              ) : (
                <div className="absolute bottom-0 right-0 rounded-[22px] border border-[rgba(255,248,238,0.35)] bg-[rgba(255,248,238,0.18)] p-3 shadow-[0_10px_25px_rgba(38,28,20,0.12)] backdrop-blur-md">
                  <div className="flex flex-wrap items-start gap-3">
                    <Input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          unlockAdmin();
                        }
                      }}
                      placeholder="输入密码"
                      className="h-10 w-[180px] border-[rgba(255,248,238,0.35)] bg-[rgba(255,248,238,0.55)] text-[#5f4330] placeholder:text-[#8b735d]"
                    />
                    <Button
                      className="rounded-full bg-[#5f4330] px-4 text-[#fbf6ef] hover:bg-[#4e3627]"
                      onClick={unlockAdmin}
                    >
                      尝试黑入
                    </Button>
                  </div>
                  {adminError ? <div className="mt-2 text-xs text-red-500">{adminError}</div> : null}
                </div>
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(27,21,17,0)_0%,rgba(27,21,17,0.58)_45%,rgba(27,21,17,0.88)_100%)] blur-xl" />
        </div>

        <div className="-mx-4 -mt-6 bg-[linear-gradient(180deg,#1b1511_0%,#231a15_45%,#2a1f19_100%)] px-4 py-6 md:-mx-8 md:px-8 md:py-8">
          <div className="relative mb-8 flex items-center gap-3">
            <div className="flex w-full max-w-[620px] items-center gap-3 rounded-[24px] border border-[rgba(224,190,152,0.20)] bg-[rgba(255,248,240,0.08)] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
              <Search className="ml-1 h-4 w-4 text-[#d1b08a]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索菜名、风味、特色"
                className="border-0 bg-transparent text-[#f4e7d8] placeholder:text-[#b79672] shadow-none focus-visible:ring-0"
              />
            </div>

            <button
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition ${showRecommendedOnly ? "border-[rgba(255,226,196,0.36)] bg-[rgba(255,214,170,0.24)] text-[#fff3e2]" : "border-[rgba(255,209,165,0.18)] bg-[rgba(255,228,194,0.10)] text-[#fff0dc]"}`}
              onClick={() => setShowRecommendedOnly((prev) => !prev)}
            >
              大V推荐
            </button>

            <button
              type="button"
              className="relative z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(224,190,152,0.22)] bg-[rgba(255,248,240,0.10)] text-[#efd6b9] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:scale-105"
              onClick={() => setCategoryMenuOpen((prev) => !prev)}
              aria-label="打开分类"
            >
              <span className="text-lg leading-none">≡</span>
            </button>

            <div className="rounded-full border border-[rgba(255,209,165,0.18)] bg-[rgba(255,228,194,0.10)] px-4 py-2 text-sm font-medium text-[#fff0dc] backdrop-blur-md">
              {showRecommendedOnly ? `${selectedCategory} · 推荐` : selectedCategory}
            </div>

            {categoryMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-30 bg-[rgba(8,6,5,0.18)] backdrop-blur-sm"
                  onClick={() => setCategoryMenuOpen(false)}
                  aria-label="关闭分类菜单"
                />
                <div
                  className="absolute left-[min(640px,calc(100%-48px))] top-14 z-40"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCategoryPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
                  }}
                  onMouseLeave={() => setCategoryPointer({ x: 0, y: 0, active: false })}
                >
                  {CATEGORY_OPTIONS.map((item, idx) => {
                    const positions = [
                      { x: 0, y: 0 },
                      { x: 74, y: -6 },
                      { x: 138, y: 16 },
                      { x: 154, y: 68 },
                      { x: 112, y: 114 },
                      { x: 38, y: 130 },
                    ];
                    const pos = positions[idx] || { x: 0, y: 0 };
                    const centerX = pos.x + 42;
                    const centerY = pos.y + 24;
                    const dx = categoryPointer.x - centerX;
                    const dy = categoryPointer.y - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const influence = categoryPointer.active ? Math.max(0, 1 - distance / 120) : 0;
                    const offsetX = influence > 0 ? dx * 0.08 : 0;
                    const offsetY = influence > 0 ? dy * 0.08 : 0;

                    return (
                      <div
                        key={item}
                        className="absolute"
                        style={{
                          ['--tx']: `${pos.x}px`,
                          ['--ty']: `${pos.y}px`,
                          animation: `categoryTrailIn 420ms cubic-bezier(0.2, 0.9, 0.2, 1) both`,
                          animationDelay: `${idx * 70}ms`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(item);
                            setCategoryMenuOpen(false);
                          }}
                          className={`flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium backdrop-blur-md transition duration-300 ${selectedCategory === item ? "border-[rgba(255,226,196,0.36)] bg-[rgba(255,214,170,0.24)] text-[#fff3e2]" : "border-[rgba(255,226,196,0.20)] bg-[rgba(255,248,239,0.10)] text-[#f2d8ba]"}`}
                          style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
                        >
                          {item}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

          <div className={`grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 ${categoryMenuOpen ? "blur-sm" : ""}`}>
            {filtered.map((dish) => (
              <Card key={dish.id} className="relative overflow-hidden rounded-[28px] border border-[rgba(255,204,150,0.24)] bg-[linear-gradient(180deg,rgba(62,30,18,0.86)_0%,rgba(42,22,16,0.78)_52%,rgba(24,14,12,0.72)_100%)] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,236,205,0.08),inset_0_-1px_0_rgba(255,188,120,0.03),0_0_0_1px_rgba(255,210,160,0.04),0_0_18px_rgba(255,150,70,0.10),0_0_34px_rgba(220,108,34,0.06),0_20px_38px_rgba(0,0,0,0.42)] transition duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1">
                <button
                  type="button"
                  className="group relative aspect-square w-full overflow-hidden bg-[rgba(102,54,28,0.18)] text-left"
                  onClick={() => setSelectedDish(dish)}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-[linear-gradient(180deg,rgba(255,236,205,0.14)_0%,rgba(255,236,205,0.04)_55%,transparent_100%)]" />
                  <img src={dish.image} alt={dish.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </button>
                <CardContent className="relative p-5">
                  <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-90"
                    style={{
                      background: `radial-gradient(720px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,236,205,0.18), rgba(255,220,170,0.10) 20%, rgba(255,195,130,0.06) 38%, rgba(255,170,100,0.03) 52%, transparent 72%)`
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-[linear-gradient(180deg,rgba(255,244,226,0.08)_0%,transparent_100%)]" />
                  <div className="relative z-10">
                    <button type="button" className="w-full text-left" onClick={() => setSelectedDish(dish)}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-[30px] font-semibold tracking-[0.12em] text-[#fff3e2]" style={{ fontFamily: '"STSong", "Songti SC", "Noto Serif SC", serif' }}>{dish.name}</h2>
                          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#e3c8ad]">{dish.shortDesc}</p>
                        </div>
                        <div className="rounded-full border border-[rgba(255,209,165,0.20)] bg-[rgba(255,228,194,0.12)] px-3 py-1 text-sm font-medium text-[#fff0dc] backdrop-blur-md">{dish.price}</div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dish.highlights.map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="rounded-full border border-[rgba(255,209,165,0.16)] bg-[rgba(255,226,191,0.08)] px-2.5 py-1 text-[11px] text-[#f7dcc0] backdrop-blur-md hover:bg-[rgba(255,226,191,0.12)]">
                            <Star className="mr-1 h-3 w-3 fill-current" /> {item}
                          </Badge>
                        ))}
                      </div>
                    </button>

                    <div className="mt-4 space-y-2 text-sm leading-6 text-[#e0c4a8]">
                      <div>
                        <div className="mb-1 text-[13px] font-medium tracking-[0.08em] text-[#fff0dc]">{dish.spice}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,245,230,0.22)_25%,rgba(255,245,230,0.28)_50%,rgba(255,245,230,0.22)_75%,transparent_100%)]" />
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[rgba(255,209,165,0.16)] bg-[rgba(255,226,191,0.07)] text-[#fff0dc] backdrop-blur-md hover:bg-[rgba(255,226,191,0.12)]" onClick={() => removeFromCart(dish.id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-6 text-center text-sm font-medium text-[#fff0dc]">{getDishQty(dish.id)}</span>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[rgba(255,209,165,0.16)] bg-[rgba(255,226,191,0.07)] text-[#fff0dc] backdrop-blur-md hover:bg-[rgba(255,226,191,0.12)]" onClick={() => addToCart(dish)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {isAdmin ? (
                        <Button
                          variant="outline"
                          className="rounded-full border-[rgba(255,209,165,0.16)] bg-transparent px-3.5 text-[#fff0dc] backdrop-blur-md hover:bg-[rgba(255,226,191,0.10)]"
                          onClick={() => setEditingDish(dish)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedDish ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(10,8,7,0.45)] backdrop-blur-md"
            onClick={() => setSelectedDish(null)}
            aria-label="关闭菜品详情"
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[32px] border border-[rgba(255,214,170,0.20)] bg-[linear-gradient(180deg,rgba(52,28,18,0.94)_0%,rgba(34,20,16,0.96)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-300">
            <div className="relative aspect-[16/8] overflow-hidden bg-[rgba(102,54,28,0.18)]">
              <img src={selectedDish.image} alt={selectedDish.name} className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-[rgba(255,230,200,0.20)] bg-[rgba(20,12,10,0.35)] p-2 text-[#fff0dc] backdrop-blur-md"
                onClick={() => setSelectedDish(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative grid gap-5 p-6 md:p-8">
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-90"
                style={{
                  background: `radial-gradient(760px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,236,205,0.18), rgba(255,220,170,0.10) 20%, rgba(255,195,130,0.06) 38%, rgba(255,170,100,0.03) 52%, transparent 72%)`
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-[linear-gradient(180deg,rgba(255,244,226,0.08)_0%,transparent_100%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[34px] font-semibold tracking-[0.08em] text-[#fff3e2]" style={{ fontFamily: '"STSong", "Songti SC", "Noto Serif SC", serif' }}>{selectedDish.name}</h2>
                  <p className="mt-2 text-[15px] leading-7 text-[#e3c8ad]">{selectedDish.shortDesc}</p>
                </div>
                <div className="rounded-full border border-[rgba(255,209,165,0.20)] bg-[rgba(255,228,194,0.12)] px-4 py-1.5 text-base font-medium text-[#fff0dc] backdrop-blur-md">{selectedDish.price}</div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {selectedDish.highlights.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="rounded-full border border-[rgba(255,209,165,0.16)] bg-[rgba(255,226,191,0.08)] px-3 py-1 text-[12px] text-[#f7dcc0] backdrop-blur-md hover:bg-[rgba(255,226,191,0.12)]">
                    <Star className="mr-1 h-3.5 w-3.5 fill-current" /> {item}
                  </Badge>
                ))}
              </div>

              <div className="relative z-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[rgba(255,209,165,0.14)] bg-[rgba(255,226,191,0.07)] p-4 backdrop-blur-md">
                  <div className="mb-2 text-[14px] font-medium tracking-[0.08em] text-[#fff0dc]">配方</div>
                  <p className="text-[14px] leading-7 text-[#e1c6aa]">{selectedDish.recipe}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(255,209,165,0.14)] bg-[rgba(255,226,191,0.07)] p-4 backdrop-blur-md">
                  <div className="mb-2 text-[14px] font-medium tracking-[0.08em] text-[#fff0dc]">做法</div>
                  <p className="text-[14px] leading-7 text-[#e1c6aa]">{selectedDish.method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog open={editingDish !== null} onOpenChange={(open) => { if (!open) setEditingDish(null); }}>
        <DialogContent className="max-w-xl rounded-[30px] border border-[#d7c3a3] bg-[#fffaf4]">
          <DialogHeader>
            <DialogTitle className="text-[#4f3928]" style={{ fontFamily: '"STSong", "Songti SC", "Noto Serif SC", serif' }}>编辑菜品</DialogTitle>
          </DialogHeader>
          {editingDish ? <DishEditor dish={editingDish} onSave={saveDish} /> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-[34px] border border-[rgba(255,214,170,0.18)] bg-[linear-gradient(180deg,rgba(44,24,16,0.94)_0%,rgba(28,18,14,0.98)_100%)] p-0 text-[#f6e7d5] shadow-[0_30px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background: `radial-gradient(760px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,236,205,0.18), rgba(255,220,170,0.10) 20%, rgba(255,195,130,0.06) 38%, rgba(255,170,100,0.03) 52%, transparent 72%)`
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,244,226,0.08)_0%,transparent_100%)]" />

            <DialogHeader className="relative z-10 mb-6 border-b border-[rgba(255,214,170,0.14)] pb-5 text-left">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs tracking-[0.18em] text-[#b99572]">ORDER BASKET</div>
                  <DialogTitle
                    className="text-[42px] font-semibold tracking-[0.08em] text-[#fff1de]"
                    style={{
                      fontFamily: '"STSong", "Songti SC", "Noto Serif SC", serif',
                      textShadow: '0 0 10px rgba(255,220,170,0.22), 0 0 24px rgba(255,170,100,0.10)'
                    }}
                  >
                    点单篮子
                  </DialogTitle>
                </div>
                <div className="rounded-full border border-[rgba(255,214,170,0.14)] bg-[rgba(255,226,191,0.08)] px-4 py-2 text-sm text-[#e7cdb2] backdrop-blur-md">
                  共 {totalItems} 份
                </div>
              </div>
            </DialogHeader>

            <div className="relative z-10 grid gap-6">
              {cart.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[28px] border border-[rgba(255,214,170,0.12)] bg-[linear-gradient(135deg,rgba(255,226,191,0.10)_0%,rgba(255,214,170,0.04)_100%)] px-6 py-8 backdrop-blur-md">
                    <div className="mb-2 text-xs tracking-[0.14em] text-[#b99572]">当前状态</div>
                    <div className="text-[24px] font-medium text-[#f3d9bc]">还没有添加菜品</div>
                    <div className="mt-3 text-sm leading-6 text-[#c9aa8d]">先去主页挑几个想吃的菜，再回来一起提交点单意向。</div>
                  </div>
                  <div className="sticky top-0 rounded-[24px] border border-[rgba(255,214,170,0.14)] bg-[linear-gradient(180deg,rgba(255,226,191,0.12)_0%,rgba(255,214,170,0.06)_100%)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,240,220,0.08)] backdrop-blur-md">
                    <div className="text-xs tracking-[0.14em] text-[#b99572]">TOTAL</div>
                    <div className="mt-3 text-[40px] font-semibold tracking-[0.04em] text-[#fff0dc]">${totalPrice.toFixed(2)}</div>
                    <div className="mt-2 text-sm text-[#d6b89d]">当前点单总价</div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                  <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[18px] border border-[rgba(255,214,170,0.10)] bg-[rgba(255,226,191,0.05)] px-3.5 py-2.5 backdrop-blur-md">
                        <div className="h-12 w-12 overflow-hidden rounded-[14px] border border-[rgba(255,214,170,0.12)] bg-[rgba(255,226,191,0.06)]">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 pr-3">
                          <div className="truncate text-[18px] font-medium tracking-[0.02em] text-[#fff0dc]" style={{ fontFamily: '"STSong", "Songti SC", "Noto Serif SC", serif' }}>
                            {item.name}
                          </div>
                          <div className="mt-0.5 text-[13px] text-[#d8baa0]">{item.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-[rgba(255,209,165,0.14)] bg-[rgba(255,226,191,0.06)] text-[#fff0dc] backdrop-blur-md hover:bg-[rgba(255,226,191,0.10)]" onClick={() => removeFromCart(item.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-4 text-center text-[13px] font-medium text-[#fff0dc]">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-[rgba(255,209,165,0.14)] bg-[rgba(255,226,191,0.06)] text-[#fff0dc] backdrop-blur-md hover:bg-[rgba(255,226,191,0.10)]" onClick={() => addToCart(item)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sticky top-0 rounded-[24px] border border-[rgba(255,214,170,0.14)] bg-[linear-gradient(180deg,rgba(255,226,191,0.12)_0%,rgba(255,214,170,0.06)_100%)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,240,220,0.08)] backdrop-blur-md">
                    <div className="text-xs tracking-[0.14em] text-[#b99572]">TOTAL</div>
                    <div className="mt-3 text-[40px] font-semibold tracking-[0.04em] text-[#fff0dc]">${totalPrice.toFixed(2)}</div>
                    <div className="mt-2 text-sm text-[#d6b89d]">当前点单总价</div>
                  </div>
                </div>
              )}

              <div className="grid gap-5 rounded-[30px] border border-[rgba(255,214,170,0.12)] bg-[rgba(255,226,191,0.05)] p-5 backdrop-blur-md md:p-6">
                <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                  <div className="grid gap-2">
                    <div className="text-xs tracking-[0.14em] text-[#b99572]">称呼</div>
                    <Input value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="你的名字" className="h-14 rounded-[22px] border-[rgba(255,214,170,0.18)] bg-[rgba(255,226,191,0.07)] px-5 text-lg text-[#fff0dc] placeholder:text-[#c8aa8f] shadow-[inset_0_1px_0_rgba(255,240,220,0.05)] focus-visible:ring-[rgba(255,214,170,0.18)]" />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs tracking-[0.14em] text-[#b99572]">备注</div>
                      <div className="text-[11px] text-[#9f7f63]">口味 / 配送 / 特殊要求</div>
                    </div>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="例如：少辣、不要香菜、几点取餐" className="min-h-32 rounded-[24px] border-[rgba(255,214,170,0.18)] bg-[rgba(255,226,191,0.07)] px-5 py-4 text-base text-[#fff0dc] placeholder:text-[#c8aa8f] shadow-[inset_0_1px_0_rgba(255,240,220,0.05)] focus-visible:ring-[rgba(255,214,170,0.18)]" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm leading-6 text-[#caa98b]">
                    提交后会尝试唤起邮件客户端；若预览环境拦截，会自动复制订单内容。
                  </div>
                  <Button
                    className="group h-16 min-w-[260px] rounded-[24px] bg-[linear-gradient(180deg,#97633d_0%,#744a2d_100%)] px-8 text-lg font-medium tracking-[0.08em] text-[#fff6eb] shadow-[0_14px_34px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,236,205,0.14)] transition duration-300 hover:scale-[1.01] hover:bg-[linear-gradient(180deg,#a36b43_0%,#7e5031_100%)]"
                    onClick={submitOrderIntent}
                  >
                    <span className="mr-2 opacity-90 transition group-hover:translate-x-0.5">✦</span>
                    提交点单意向
                  </Button>
                </div>

                {submitFeedback ? (
                  <div className="rounded-[18px] border border-[rgba(255,214,170,0.14)] bg-[rgba(255,226,191,0.07)] px-4 py-3 text-sm text-[#e7cdb2] backdrop-blur-md">
                    {submitFeedback}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={() => {
          if (!dragging) setCartOpen(true);
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed z-50 flex h-16 w-16 items-center justify-center rounded-full border border-[#d4bb98] bg-[radial-gradient(circle_at_30%_30%,#7a563d_0%,#5a3f2d_55%,#453022_100%)] text-[#fff8ef] shadow-[0_18px_35px_rgba(62,43,28,0.28)] transition hover:scale-105 active:scale-95"
        style={{ right: cartButtonPos.x, bottom: cartButtonPos.y }}
        aria-label="打开点单篮子"
      >
        <div className="relative flex items-center justify-center">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 ? (
            <span className="absolute -right-3 -top-3 flex h-6 min-w-6 items-center justify-center rounded-full border border-[#e5cfad] bg-[#f0d7ab] px-1 text-xs font-semibold text-[#503827]">
              {totalItems}
            </span>
          ) : null}
        </div>
      </button>
    </div>
  );
}
