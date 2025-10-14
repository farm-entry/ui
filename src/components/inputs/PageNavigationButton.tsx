import { Box, CardActionArea, Typography } from "@mui/material";
import { JSX } from "react";
import { CustomCard } from "../framework";

export interface OptionType {
  label: String;
  icon?: JSX.Element;
  href: String;
  description?: String;
}

const PageNavigationButton = ({ option, navigate }: { option: OptionType; navigate: any }) => {
  return (
    <CustomCard variant="outlined" full>
      <CardActionArea onClick={() => navigate(option.href)} sx={{ p: 2 }}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" height="100%" width="100%">
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>{option.icon}</Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" flex={1}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {option.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {option.description}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </CustomCard>
  );
};

export default PageNavigationButton;
