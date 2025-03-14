self.onmessage = function (e) {
  const { data, sortKey, sortBy } = e.data;

  // Pakai collator untuk sorting yang lebih natural
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  const sorted = [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    return sortBy === 'asc' ? collator.compare(aValue, bValue) : collator.compare(bValue, aValue);
  });

  self.postMessage(sorted); // Kirim hasilnya kembali
};
