import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  Transition,
  Menu,
  MenuButton,
  Switch,
  Tab,
  TabGroup,
  TabList,
} from "@headlessui/react";
import {
  Menu as MenuIcon,
  X,
  Search,
  Rocket,
  Database,
  Code2,
  Layers,
  Sun,
  Moon,
  ChevronDown,
  UploadCloud,
  Box,
  Settings,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

import ThemeToggle from "./components/ThemeToggle";
function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

const NAV = [
  { name: "Home", icon: Rocket, href: "#home" },
  { name: "Standards", icon: Layers, href: "#standards" },
  { name: "Playground", icon: Code2, href: "#playground" },
  { name: "Storage", icon: UploadCloud, href: "#storage" },
  { name: "Registry", icon: Database, href: "#registry" },
];

const TAGS = [
  "telemetry",
  "ephemeris",
  "comms",
  "payload",
  "ground",
  "ops",
  "sim",
  "json",
  "flatbuffers",
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const filteredTags = useMemo(() => {
    if (!query) return TAGS;
    return TAGS.filter((t) => t.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <>
      <div className="w-screen bg-[#0e0f12] text-slate-100">
        <div className="max-w-[1600px] mx-auto flex h-screen overflow-hidden">
          {/* Mobile sidebar */}
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/70" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-200 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-200 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        className="text-slate-300 hover:text-white focus:outline-none"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <Sidebar
                      query={query}
                      setQuery={setQuery}
                      activeTag={activeTag}
                      setActiveTag={setActiveTag}
                      onNavigate={() => setSidebarOpen(false)}
                      mobile
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar (desktop) */}
          <Sidebar
            className="hidden lg:flex lg:w-72 lg:flex-col lg:shrink-0 lg:border-r lg:border-white/5"
            query={query}
            setQuery={setQuery}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            onNavigate={() => {}}
          />

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Topbar
              onOpenSidebar={() => setSidebarOpen(true)}
              dark={dark}
              setDark={setDark}
            />

            {/* Content area: scrollable but hidden scrollbars */}
            <main className="no-scrollbar flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mx-auto max-w-7xl space-y-8">
                <Hero />
                <ContentGrid query={query} activeTag={activeTag} />
              </div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

function Sidebar({
  className = "",
  query,
  setQuery,
  activeTag,
  setActiveTag,
  onNavigate,
  mobile = false,
}) {
  return (
    <aside
      className={cx(
        "no-scrollbar h-full overflow-auto bg-[#0b0c0f] text-slate-200",
        mobile ? "w-full" : "",
        className
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/5">
        <Box className="h-6 w-6 text-violet-400" />
        <span className="font-semibold tracking-tight">SpaceDataStandards</span>
        <span className="ml-auto text-[10px] px-2 py-1 bg-white/5 text-slate-300">
          v2.0
        </span>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5">
          <Search className="h-4 w-4 opacity-60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search standards, tags, or IDs"
            className="w-full bg-transparent outline-none text-sm placeholder:opacity-60"
          />
        </div>
      </div>

      <nav className="px-2 py-2">
        {NAV.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5"
          >
            <item.icon className="h-4 w-4 opacity-80" />
            {item.name}
          </a>
        ))}
      </nav>

      <div className="mt-4 px-4">
        <h4 className="text-xs uppercase tracking-wide opacity-60 mb-2">
          Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {filteredTagList(query).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
              className={cx(
                "px-3 py-1 text-xs border",
                activeTag === t
                  ? "border-violet-400 text-violet-300 bg-violet-400/10"
                  : "border-white/10 hover:bg-white/5"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="border border-white/10 p-4 bg-white/5">
          <p className="text-xs opacity-80">
            Connected to S3 and on-device cache for blazing search. Configure in{" "}
            <span className="font-semibold">Settings</span>.
          </p>
          <a
            href="#settings"
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-2 text-xs text-violet-300 hover:underline"
          >
            <Settings className="h-3.5 w-3.5" />
            Open Settings
          </a>
        </div>
        <a
          href="https://github.com/digitalarsenal/beta.spacedatastandards.org"
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 text-xs opacity-75 hover:opacity-100"
        >
          <SiGithub className="h-5 w-5" />
        </a>
      </div>
    </aside>
  );
}

function Topbar({ onOpenSidebar, dark, setDark }) {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/5 bg-[#0e0f12]/95 px-4 sm:px-6 lg:px-8">
      <button
        className="lg:hidden p-2 hover:bg-white/5"
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-2xl">
        <div className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5 w-full">
          <Search className="h-4 w-4 opacity-60" />
          <input
            placeholder="Quick search…"
            className="w-full bg-transparent outline-none text-sm placeholder:opacity-60"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle checked={dark} onChange={setDark} />
        <Menu as="div" className="relative">
          <MenuButton className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5 text-sm">
            <span className="hidden sm:inline">Actions</span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right border border-white/10 bg-[#0b0c0f] p-1 shadow-xl focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#new-standard"
                    className={cx(
                      active ? "bg-white/5" : "",
                      "flex items-center gap-2 px-3 py-2 text-sm"
                    )}
                  >
                    <Layers className="h-4 w-4" />
                    New Standard
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#upload"
                    className={cx(
                      active ? "bg-white/5" : "",
                      "flex items-center gap-2 px-3 py-2 text-sm"
                    )}
                  >
                    <UploadCloud className="h-4 w-4" />
                    Upload to S3
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#sdk"
                    className={cx(
                      active ? "bg-white/5" : "",
                      "flex items-center gap-2 px-3 py-2 text-sm"
                    )}
                  >
                    <Code2 className="h-4 w-4" />
                    Generate SDK
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="border border-white/10 bg-violet-500/10 p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            SpaceDataStandards
            <span className="opacity-60"> 2.0</span>
          </h1>
          <p className="text-sm opacity-80 max-w-2xl">
            Find standards, inspect IDL, generate code for FlatBuffers and JSON,
            convert JSON ⇄ FlatBuffer in-browser, and sync with S3.
          </p>
        </div>
        <TabGroup>
          <TabList className="flex flex-wrap gap-2">
            <HeroTab>Standards</HeroTab>
            <HeroTab>Playground</HeroTab>
            <HeroTab intent="alt">Storage</HeroTab>
          </TabList>
        </TabGroup>
      </div>
    </section>
  );
}

function HeroTab({ children, intent }) {
  return (
    <Tab
      className={({ selected }) =>
        cx(
          "px-3 py-1.5 text-sm border",
          selected
            ? intent === "alt"
              ? "border-emerald-400 text-emerald-300 bg-emerald-400/10"
              : "border-violet-400 text-violet-300 bg-violet-400/10"
            : "border-white/10 hover:bg-white/5"
        )
      }
    >
      {children}
    </Tab>
  );
}

function ContentGrid({ query, activeTag }) {
  const cards = useMemo(() => {
    const seed = [
      {
        title: "Telemetry (v1)",
        tag: "telemetry",
        desc: "Canonical spacecraft telemetry frame with channels and timestamps.",
      },
      {
        title: "Ephemeris (v1)",
        tag: "ephemeris",
        desc: "States in ECI with attitude quaternion.",
      },
      {
        title: "Comms Packet (v1)",
        tag: "comms",
        desc: "Downlink frame with FEC and interleaving.",
      },
      {
        title: "Payload Image (v1)",
        tag: "payload",
        desc: "Image tiles with calibration metadata.",
      },
      {
        title: "Ground Command (v1)",
        tag: "ground",
        desc: "Command envelope and routing.",
      },
    ];
    let out = seed;
    if (activeTag) out = out.filter((c) => c.tag === activeTag);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q)
      );
    }
    return out;
  }, [query, activeTag]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
      {cards.map((c) => (
        <article
          key={c.title}
          className="border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 grid place-items-center bg-violet-400/10 text-violet-300">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{c.title}</h3>
              <p className="text-xs opacity-70">{c.tag}</p>
            </div>
          </div>
          <p className="text-sm opacity-80 line-clamp-3">{c.desc}</p>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <a
              href="#view"
              className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5"
            >
              View
            </a>
            <a
              href="#idl"
              className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5"
            >
              IDL
            </a>
            <a
              href="#generate"
              className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5"
            >
              Generate
            </a>
          </div>
        </article>
      ))}

      <article className="border border-dashed border-white/10 p-6 grid place-items-center">
        <div className="text-center">
          <p className="text-sm opacity-80">Nothing else matches.</p>
          <a
            href="#new"
            className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5"
          >
            <Rocket className="h-4 w-4" />
            Create a new standard
          </a>
        </div>
      </article>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 pb-6">
      <div className="mx-auto max-w-7xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs opacity-80">
          © {new Date().getFullYear()} SpaceDataStandards.org. All rights
          reserved.
        </p>
        <div className="flex items-center gap-3 text-xs">
          <a href="#terms" className="hover:underline">
            Terms
          </a>
          <span className="opacity-30">•</span>
          <a href="#privacy" className="hover:underline">
            Privacy
          </a>
          <span className="opacity-30">•</span>
          <a href="#status" className="hover:underline">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}

/* Helpers */
function filteredTagList(q) {
  if (!q) return TAGS;
  const s = q.toLowerCase();
  return TAGS.filter((t) => t.toLowerCase().includes(s));
}
