
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import CandleForm from "./CandleForm";
import { Candle } from '@/types/candle';
import { CandleFormData } from '@/types/admin';
import { useCandleContext } from '@/context/CandleContext';

interface CandleManagerProps {
  darkMode: boolean;
}

const CandleManager: React.FC<CandleManagerProps> = ({ darkMode }) => {
  const { candles, setCandles } = useCandleContext();
  const [editingCandle, setEditingCandle] = useState<CandleFormData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddCandle = (candleData: CandleFormData) => {
    const newCandle = {
      ...candleData,
      id: Date.now().toString() // Simple ID generation
    } as Candle;

    setCandles([...candles, newCandle]);
    setIsAddDialogOpen(false);
    toast({
      title: "Candle Added",
      description: `${candleData.name} has been added successfully.`
    });
  };

  const handleEditCandle = (candleData: CandleFormData) => {
    if (!candleData.id) return;

    setCandles(candles.map(candle => 
      candle.id === candleData.id ? { ...candle, ...candleData } as Candle : candle
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Candle Updated",
      description: `${candleData.name} has been updated successfully.`
    });
  };

  const handleDeleteCandle = (id: string) => {
    setCandles(candles.filter(candle => candle.id !== id));
    toast({
      title: "Candle Deleted",
      description: "The candle has been deleted successfully."
    });
  };

  const toggleVisibility = (id: string) => {
    setCandles(candles.map(candle => 
      candle.id === id ? { ...candle, isLive: !candle.isLive } as Candle : candle
    ));
    
    const candle = candles.find(c => c.id === id);
    const newStatus = candle?.isLive ? "hidden" : "visible";
    
    toast({
      title: "Visibility Updated",
      description: `${candle?.name} is now ${newStatus}.`
    });
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-playfair">Manage Candles</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/80 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Candle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl">Add New Candle</DialogTitle>
            </DialogHeader>
            <CandleForm onSubmit={handleAddCandle} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className={darkMode ? "bg-gray-800" : "bg-white"}>
        <CardHeader>
          <CardTitle>Candle Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candles.map((candle) => (
                  <TableRow key={candle.id}>
                    <TableCell className="font-mono text-sm">{candle.id.slice(0, 6)}</TableCell>
                    <TableCell>
                      <img 
                        src={candle.image} 
                        alt={candle.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{candle.name}</TableCell>
                    <TableCell>{candle.type}</TableCell>
                    <TableCell>₹{(candle as any).price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        !(candle as any).isLive 
                          ? 'bg-gray-200 text-gray-800' 
                          : (candle as any).isComingSoon
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {!(candle as any).isLive 
                          ? 'Hidden' 
                          : (candle as any).isComingSoon 
                            ? 'Coming Soon' 
                            : 'Live'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleVisibility(candle.id)}
                      >
                        {(candle as any).isLive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>

                      <Dialog open={isEditDialogOpen && editingCandle?.id === candle.id} onOpenChange={(open) => {
                        if (!open) setEditingCandle(null);
                        setIsEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingCandle({
                              ...candle,
                              price: (candle as any).price || 0,
                              isLive: (candle as any).isLive || false,
                              isComingSoon: (candle as any).isComingSoon || false,
                            })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-playfair text-2xl">Edit Candle</DialogTitle>
                          </DialogHeader>
                          {editingCandle && <CandleForm candle={editingCandle} onSubmit={handleEditCandle} />}
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setDeleteTargetId(candle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {candles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No candles found. Add your first candle product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={Boolean(deleteTargetId)} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the candle from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteTargetId) {
                  handleDeleteCandle(deleteTargetId);
                  setDeleteTargetId(null);
                }
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CandleManager;
