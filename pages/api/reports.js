import { connectToDatabase } from "../../utils/mongodb";
import { Report } from "../../models";
export default async (req, res) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const reports = await Report.find({}).lean();
      res.status(200).json({ reports });
      break;
    }

    case "POST": {
      // userid will come from an authenticated user in the future
      const {
        reportType,
        reportedItem,
        extraDetails,
        reportingUser,
      } = req.body.report;
      const report = new Report({
        reportType,
        reportedItem,
        extraDetails,
        reportingUser,
      });
      report.save;
      res.status(201).json({ report });
      break;
    }
    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
