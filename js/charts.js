/* ======================================================
   Genius Solar CMS — SVG Gantt-style Timeline Chart
   ====================================================== */
const Charts = (() => {
  const COLORS = {
    completed: '#22c55e',
    pending: '#3b82f6',
    overdue: '#ef4444',
    skipped: '#9ca3af',
    gridLine: '#e5e7eb',
    text: '#6b7280',
    headerBg: '#f9fafb',
    labelText: '#1a2744'
  };

  const ROW_H = 40;
  const LABEL_W = 160;
  const MONTH_W = 38;
  const HEADER_H = 50;
  const DOT_R = 8;
  const PADDING = 16;

  function renderTimeline(container) {
    container.innerHTML = '';
    const customers = Data.getAllCustomers();
    if (customers.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:40px"><h3>No customers yet</h3><p>Add a customer to see the service timeline</p></div>';
      return;
    }

    let minDate = null, maxDate = null;
    customers.forEach(c => {
      (c.services || []).forEach(s => {
        if (s.status === 'skipped') return; // Skip skipped services
        const d = new Date(s.dueDate);
        if (!minDate || d < minDate) minDate = new Date(d);
        if (!maxDate || d > maxDate) maxDate = new Date(d);
      });
    });

    if (!minDate) {
      container.innerHTML = '<div class="empty-state" style="padding:40px"><h3>No active services</h3><p>All services are skipped or completed</p></div>';
      return;
    }

    minDate.setMonth(minDate.getMonth() - 1);
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 2);
    maxDate.setDate(1);

    const months = [];
    const cur = new Date(minDate);
    while (cur <= maxDate) {
      months.push(new Date(cur));
      cur.setMonth(cur.getMonth() + 1);
    }

    const chartW = LABEL_W + months.length * MONTH_W + PADDING;
    const chartH = HEADER_H + customers.length * ROW_H + PADDING;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', chartW);
    svg.setAttribute('height', chartH);
    svg.setAttribute('viewBox', `0 0 ${chartW} ${chartH}`);
    svg.style.minWidth = chartW + 'px';

    svg.appendChild(_rect(0, 0, chartW, chartH, '#fff', svgNS));
    svg.appendChild(_rect(0, 0, chartW, HEADER_H, COLORS.headerBg, svgNS));

    months.forEach((m, i) => {
      const x = LABEL_W + i * MONTH_W;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', HEADER_H);
      line.setAttribute('x2', x); line.setAttribute('y2', chartH);
      line.setAttribute('stroke', COLORS.gridLine); line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
      // Show every month label
      const label = _text(x + MONTH_W / 2, 20, _monthLabel(m), 9, COLORS.text, svgNS, 'middle');
      svg.appendChild(label);
      // Show year below Jan or first month
      if (m.getMonth() === 0 || i === 0) {
        const yr = _text(x + MONTH_W / 2, 34, m.getFullYear().toString(), 10, COLORS.labelText, svgNS, 'middle');
        yr.setAttribute('font-weight', '600');
        svg.appendChild(yr);
      }
    });

    svg.appendChild(_line(0, HEADER_H, chartW, HEADER_H, COLORS.gridLine, svgNS));

    customers.forEach((cust, ri) => {
      const y = HEADER_H + ri * ROW_H;
      if (ri % 2 === 1) svg.appendChild(_rect(0, y, chartW, ROW_H, '#f9fafb', svgNS));
      svg.appendChild(_line(0, y, chartW, y, COLORS.gridLine, svgNS));

      const nameLabel = _text(12, y + ROW_H / 2 + 4, _truncate(cust.name, 18), 12, COLORS.labelText, svgNS, 'start');
      nameLabel.setAttribute('font-weight', '500');
      svg.appendChild(nameLabel);

      (cust.services || []).forEach(svc => {
        // Don't draw skipped services on the chart
        if (svc.status === 'skipped') return;

        const svcDate = new Date(svc.dueDate);
        const monthsFromStart = _monthDiff(minDate, svcDate);
        const cx = LABEL_W + monthsFromStart * MONTH_W + MONTH_W / 2;
        const cy = y + ROW_H / 2;
        const status = Data.getServiceStatus(svc.dueDate, svc.status);
        const color = COLORS[status] || COLORS.pending;

        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', DOT_R);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        circle.style.transition = 'r .15s ease';

        const title = document.createElementNS(svgNS, 'title');
        title.textContent = `${cust.name} — Service #${svc.serviceNumber}\nDue: ${_formatDate(svc.dueDate)}\nStatus: ${status}${svc.doneDate ? '\nDone: ' + _formatDate(svc.doneDate) : ''}`;
        circle.appendChild(title);

        circle.addEventListener('mouseenter', () => circle.setAttribute('r', DOT_R + 3));
        circle.addEventListener('mouseleave', () => circle.setAttribute('r', DOT_R));

        svg.appendChild(circle);
      });
    });

    container.appendChild(svg);

    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;gap:16px;padding:12px 16px;font-size:12px;font-weight:500;color:#6b7280;border-top:1px solid #e5e7eb;flex-wrap:wrap;';
    legend.innerHTML = `
      <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;border-radius:50%;background:${COLORS.completed}"></span>Completed</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;border-radius:50%;background:${COLORS.pending}"></span>Upcoming</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;border-radius:50%;background:${COLORS.overdue}"></span>Overdue</span>
      <span style="display:flex;align-items:center;gap:5px;opacity:.6"><span style="width:12px;height:12px;border-radius:50%;background:${COLORS.skipped}"></span>Skipped (hidden)</span>
    `;
    container.appendChild(legend);
  }

  function _rect(x, y, w, h, fill, ns) {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('fill', fill);
    return r;
  }
  function _line(x1, y1, x2, y2, stroke, ns) {
    const l = document.createElementNS(ns, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', stroke); l.setAttribute('stroke-width', '1');
    return l;
  }
  function _text(x, y, str, size, fill, ns, anchor) {
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('font-size', size + 'px');
    t.setAttribute('fill', fill);
    t.setAttribute('text-anchor', anchor || 'start');
    t.textContent = str;
    return t;
  }
  function _monthDiff(from, to) {
    return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  }
  function _monthLabel(d) {
    return d.toLocaleString('en', { month: 'short' });
  }
  function _formatDate(ds) {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function _truncate(str, max) {
    return str.length > max ? str.substring(0, max - 1) + '…' : str;
  }

  return { renderTimeline };
})();
