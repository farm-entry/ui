import { Box, Tab, Tabs } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import CustomPageContainer from "../../components/framework/CustomPageContainer";
import HistoryTab from "./HistoryPage";
import UploadBox from "./UploadBox";

export default function DataPostPage() {
  const [tab, setTab] = useState(0);

  return (
    <CustomPageContainer headerOptions={{ title: "Data Post" }}>
      <Tabs centered value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, minHeight: 40 }}>
        <Tab
          icon={<CloudUploadIcon fontSize="small" />}
          iconPosition="start"
          label="Upload a File"
          sx={{ minHeight: 40, py: 0.5 }}
        />
        <Tab
          icon={<HistoryIcon fontSize="small" />}
          iconPosition="start"
          label="View Upload History"
          sx={{ minHeight: 40, py: 0.5 }}
        />
      </Tabs>
      <Box>
        {tab === 0 && <UploadBox />}
        {tab === 1 && <HistoryTab />}
      </Box>
    </CustomPageContainer>
  );
}
