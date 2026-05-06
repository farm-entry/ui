import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import { useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { Button, TextField, TypeAhead } from "../../components/inputs";
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
  const [selectedValue, setSelectedValue] = useState("");
  const [quantity, setQuantity] = useState("");

  const selectedItem = items.find((i) => String(i.number) === selectedValue) ?? null;
  const canAdd = !!selectedItem && !!quantity && Number(quantity) > 0;

  const mockWatch = ((name: string) => selectedValue) as UseFormWatch<any>;

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
    setSelectedValue("");
    setQuantity("");
  };

  const totalCost = lineItems.reduce((sum, li) => sum + li.quantity * li.cost, 0);

  return (
    <Box>
      <Stack spacing={1} pt={lineItems.length > 0 ? 2 : 0}>
        <TypeAhead
          watch={mockWatch}
          fieldName="selectedItem"
          handleChange={(v) => setSelectedValue(v ? String(v.value) : "")}
          valueList={items as unknown as Record<string, unknown>[]}
          labelKey="description"
          valueKey="number"
          placeholder="Select item"
          disabled={items.length === 0}
          noOptionsText="No items available"
        />

        {selectedItem && (
          <Typography variant="caption" color="text.secondary" pl={0.5}>
            {selectedItem.type} · ${selectedItem.cost.toFixed(2)} / {selectedItem.unit}
          </Typography>
        )}

        <Stack direction="row" spacing={1}>
          <Box sx={{ flex: { flex: 3 } }}>
            <TextField
              placeholder="Qty"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={!selectedItem}
              slotProps={{
                htmlInput: { min: 1 },
                input: {
                  endAdornment: selectedItem ? (
                    <InputAdornment position="end">{selectedItem.unit}</InputAdornment>
                  ) : undefined
                }
              }}
            />
          </Box>
          <Box sx={{ xs: 2, sm: 1 }} display="flex" alignItems="center">
            <Button
              fullHeight
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={!canAdd}
              sx={{ ...(!canAdd && { borderColor: "transparent !important" }) }}
              fullWidth
            >
              Add Item
            </Button>
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <List disablePadding>
        {lineItems.length <= 0 && (
          <Typography variant="body2" color="text.secondary" align="center" py={2}>
            No items added
          </Typography>
        )}
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
      {lineItems.length > 0 && (
        <Box display="flex" justifyContent="flex-end" pt={1} pb={2}>
          <Typography variant="body2" fontWeight="bold">
            Total: ${totalCost.toFixed(2)}
          </Typography>
        </Box>
      )}
      <Divider />
    </Box>
  );
}
