import { Add, Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { InventoryItem, InventoryLineItem } from "../../store/types/inventory";

interface InventoryItemListProps {
  lineItems: InventoryLineItem[];
  items: InventoryItem[];
  onAdd: (lineItem: InventoryLineItem) => void;
  onRemove: (index: number) => void;
}

export default function InventoryItemList({
  lineItems,
  items,
  onAdd,
  onRemove
}: InventoryItemListProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("");

  const canAdd = !!selectedItem && !!quantity && Number(quantity) > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      itemNumber: selectedItem!.number,
      description: selectedItem!.description,
      type: selectedItem!.type,
      quantity: Number(quantity),
      cost: selectedItem!.cost,
      unit: selectedItem!.unit
    });
    setSelectedItem(null);
    setQuantity("");
  };

  const totalCost = lineItems.reduce((sum, li) => sum + li.quantity * li.cost, 0);

  return (
    <Box>
      <Stack spacing={1} pt={lineItems.length > 0 ? 2 : 0}>
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option.description}
          value={selectedItem}
          onChange={(_, value) => setSelectedItem(value)}
          disabled={items.length === 0}
          renderInput={(params) => <TextField {...params} placeholder="Select item" size="small" />}
          noOptionsText="No items available"
          isOptionEqualToValue={(option, value) => option.number === value.number}
        />

        {selectedItem && (
          <Typography variant="caption" color="text.secondary" pl={0.5}>
            {selectedItem.type} · ${selectedItem.cost.toFixed(2)} / {selectedItem.unit}
          </Typography>
        )}

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="Qty"
            placeholder="Qty"
            type="number"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={!selectedItem}
            slotProps={{
              inputLabel: { shrink: !!quantity || undefined },
              input: {
                endAdornment: selectedItem ? (
                  <InputAdornment position="end">{selectedItem.unit}</InputAdornment>
                ) : undefined
              },
              htmlInput: { min: 1 },
            }}
            sx={{ width: 130 }}
          />
          <IconButton
            color="primary"
            onClick={handleAdd}
            disabled={!canAdd}
            size="medium"
            sx={{
              border: 1,
              borderColor: canAdd ? "primary.main" : "action.disabled",
              borderRadius: 1
            }}
          >
            <Add />
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      {lineItems.length > 0 && (
        <>
          <List disablePadding>
            {lineItems.map((li, i) => (
              <Box key={i}>
                <ListItem
                  disableGutters
                  secondaryAction={
                    <IconButton edge="end" onClick={() => onRemove(i)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={li.description}
                    secondary={`${li.quantity} ${li.unit}  ·  $${li.cost.toFixed(2)} each`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: "body2" }}
                  />
                  <Typography variant="body2" fontWeight={600} sx={{ mr: 5, flexShrink: 0 }}>
                    ${(li.quantity * li.cost).toFixed(2)}
                  </Typography>
                </ListItem>
                {i < lineItems.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>

          <Box display="flex" justifyContent="flex-end" pt={1} pb={2}>
            <Typography variant="body2" fontWeight="bold">
              Total: ${totalCost.toFixed(2)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
