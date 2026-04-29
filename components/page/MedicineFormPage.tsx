'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function MedicineFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    reorderLevel: '',
    expiryDate: '',
  });
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const qty = parseInt(formData.quantity);
    const reorder = parseInt(formData.reorderLevel);

    if (isNaN(qty) || isNaN(reorder)) {
      toast.error('Invalid input', {
        description: 'Quantity and Reorder Level must be valid numbers.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Insert medicine
      const { data: medicineData, error: medicineError } = await supabase
        .from('medicines')
        .insert({
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          quantity: qty,
          reorder_level: reorder,
          expiry_date: formData.expiryDate || null,
        })
        .select()
        .single();

      if (medicineError) {
        console.error('Supabase Medicine Error:', medicineError);
        throw new Error(medicineError.message || 'Failed to insert medicine');
      }

      if (!medicineData) {
        throw new Error('No data returned from medicine insertion');
      }

      // 2. Add an initial stock transaction
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          medicine_id: medicineData.id,
          type: 'Stock In',
          quantity: qty,
        });

      if (transactionError) {
        console.warn('Initial transaction failed (non-critical):', transactionError);
      }

      toast.success('Medicine added successfully!', {
        description: `${formData.name} has been added to the inventory.`,
      });
      
      router.push('/medicines');
      router.refresh();
    } catch (error: any) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push('/medicines')}
        className="mb-6 px-0"
      >
        <ArrowLeft className="size-4" />
        <span className="text-sm">Back to Inventory</span>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add New Medicine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm mb-1.5 text-foreground">
                  Medicine Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Paracetamol 500mg"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm mb-1.5 text-foreground">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analgesic">Analgesic</SelectItem>
                    <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                    <SelectItem value="Antihypertensive">Antihypertensive</SelectItem>
                    <SelectItem value="Antidiabetic">Antidiabetic</SelectItem>
                    <SelectItem value="Antihistamine">Antihistamine</SelectItem>
                    <SelectItem value="Bronchodilator">Bronchodilator</SelectItem>
                    <SelectItem value="Antacid">Antacid</SelectItem>
                    <SelectItem value="Antidiarrheal">Antidiarrheal</SelectItem>
                    <SelectItem value="Vitamin">Vitamin</SelectItem>
                    <SelectItem value="Iron Supplement">Iron Supplement</SelectItem>
                    <SelectItem value="Electrolyte">Electrolyte</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div>
                <label htmlFor="unit" className="block text-sm mb-1.5 text-foreground">
                  Unit
                </label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablets">Tablets</SelectItem>
                    <SelectItem value="Capsules">Capsules</SelectItem>
                    <SelectItem value="Sachets">Sachets</SelectItem>
                    <SelectItem value="Bottles">Bottles</SelectItem>
                    <SelectItem value="Boxes">Boxes</SelectItem>
                    <SelectItem value="Vials">Vials</SelectItem>
                    <SelectItem value="Syrup">Syrup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm mb-1.5 text-foreground">
                  Quantity in Stock
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="reorderLevel" className="block text-sm mb-1.5 text-foreground">
                  Reorder Level
                </label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm mb-1.5 text-foreground">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/medicines')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Medicine'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
