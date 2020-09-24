import { connectToDatabase } from "../../../utils/mongodb";
import { Report } from "../../../models";
export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const report = await Report.findById(id).lean();
      res.status(200).json({ report });
      break;
    }

    case "PUT": {
      const updateFields = req.body.updateReport;
      const report = await Report.findByIdAndUpdate(id, updateFields, {
        new: true,
        lean: true,
      });
      res.status(200).json({ report });
      break;
    }

    case "DELETE": {
      await Report.findByIdAndDelete(id);
      res.status(200).json({ serial: "Report deleted" });
    }

    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
