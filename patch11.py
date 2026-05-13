with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
import_old = """import {
  Bell,
  CalendarDays,
  Clock3,
  Moon,
  Sun,
} from "lucide-react";"""

import_new = """import {
  Bell,
  CalendarDays,
  Clock3,
  Moon,
  Sun,
  Zap,
  TrendingDown,
  RefreshCw,
  DollarSign
} from "lucide-react";"""

content = content.replace(import_old, import_new)

# 2. Update KPI cards
kpi1_old = '<div className="kpi-card-top"><p>Safe Capacity</p></div>'
kpi1_new = '<div className="kpi-card-top"><p>Safe Capacity</p><div className="kpi-card-icon"><Zap size={18} /></div></div>'

kpi2_old = '<div className="kpi-card-top"><p>Peak Reduction</p></div>'
kpi2_new = '<div className="kpi-card-top"><p>Peak Reduction</p><div className="kpi-card-icon"><TrendingDown size={18} /></div></div>'

kpi3_old = '<div className="kpi-card-top"><p>Energy Shifted</p></div>'
kpi3_new = '<div className="kpi-card-top"><p>Energy Shifted</p><div className="kpi-card-icon"><RefreshCw size={18} /></div></div>'

kpi4_old = '<div className="kpi-card-top"><p>Estimated Saving</p></div>'
kpi4_new = '<div className="kpi-card-top"><p>Estimated Saving</p><div className="kpi-card-icon"><DollarSign size={18} /></div></div>'

content = content.replace(kpi1_old, kpi1_new)
content = content.replace(kpi2_old, kpi2_new)
content = content.replace(kpi3_old, kpi3_new)
content = content.replace(kpi4_old, kpi4_new)

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
