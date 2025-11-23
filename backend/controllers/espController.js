import axios from "axios";

const esp = (path) =>
  axios.get(process.env.ESP32_IP + path, { timeout: 10000 })
       .then(res => res.data);

// فتح الغطاء
export const openLid = async (req, res) => {
  try {
    const data = await esp("/open");
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// غلق الغطاء
export const closeLid = async (req, res) => {
  try {
    const data = await esp("/close");
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// نسبة الامتلاء
export const fillStatus = async (req, res) => {
  try {
    const data = await esp("/fillstatus");
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
