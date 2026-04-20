'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Play, Eraser, AlertCircle, CheckCircle2, Loader2, Table as TableIcon, FileJson } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SQLEditorPage() {
  const [query, setQuery] = useState('SELECT * FROM medicines LIMIT 5;');
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'table' | 'json'>('table');
  const supabase = createClient();

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // First attempt: try to use exec_sql RPC if it exists
      const { data, error: rpcError } = await supabase.rpc('exec_sql', { sql_query: query });

      if (rpcError) {
        // If RPC fails (e.g. doesn't exist), we might want to tell the user how to set it up
        if (rpcError.message.includes('function rpc.exec_sql(text) does not exist')) {
          setError('The "exec_sql" RPC function is not found. Please run the setup script in your Supabase SQL Editor to enable arbitrary SQL execution.');
        } else {
          setError(rpcError.message);
        }
      } else if (data && data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            SQL Editor
          </h1>
          <p className="text-muted-foreground mt-1">
            Execute SQL queries directly against your Supabase database.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-teal-100 shadow-md bg-white/50 backdrop-blur-sm overflow-hidden border-2">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-teal-900">Query Terminal</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                  className="border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleExecute}
                  disabled={loading || !query.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Execute Query
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full min-h-[200px] p-6 font-mono text-sm bg-slate-900 text-teal-300 focus:outline-none focus:ring-0 resize-y selection:bg-teal-500/30"
              placeholder="-- Write your SQL query here...
SELECT * FROM table_name;"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Execution Error</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>{error}</p>
                {error.includes('exec_sql') && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-md overflow-x-auto border border-slate-700 shadow-inner">
                    <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Setup Script:</p>
                    <code className="text-xs text-emerald-400 whitespace-pre">
{`CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;`}
                    </code>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-emerald-100 shadow-lg overflow-hidden border-2">
                <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-50 bg-white py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-sm font-medium text-slate-600">
                      Query Results ({results.length} rows)
                    </CardTitle>
                  </div>
                  <Tabs defaultValue="table" className="w-[200px]" onValueChange={(v) => setView(v as any)}>
                    <TabsList className="grid w-full grid-cols-2 h-8">
                      <TabsTrigger value="table" className="text-xs">
                        <TableIcon className="h-3 w-3 mr-1.5" />
                        Table
                      </TabsTrigger>
                      <TabsTrigger value="json" className="text-xs">
                        <FileJson className="h-3 w-3 mr-1.5" />
                        JSON
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="table" value={view}>
                    <TabsContent value="table" className="m-0 border-0 outline-none">
                      <div className="max-h-[400px] overflow-auto">
                        <Table>
                          <TableHeader className="bg-slate-50 sticky top-0 z-10">
                            <TableRow>
                              {Object.keys(results[0] || {}).map((key) => (
                                <TableHead key={key} className="font-bold text-slate-700 capitalize">
                                  {key}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.length > 0 ? (
                              results.map((row, i) => (
                                <TableRow key={i} className="hover:bg-emerald-50/50 transition-colors">
                                  {Object.values(row).map((val: any, j) => (
                                    <TableCell key={j} className="text-slate-600">
                                      {val === null ? (
                                        <span className="text-slate-300 italic">null</span>
                                      ) : typeof val === 'object' ? (
                                        JSON.stringify(val)
                                      ) : (
                                        String(val)
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={100} className="text-center py-10 text-slate-400">
                                  No records found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    <TabsContent value="json" className="m-0 border-0 outline-none">
                      <div className="bg-slate-900 p-6 max-h-[400px] overflow-auto">
                        <pre className="text-teal-400 text-sm font-mono leading-relaxed">
                          {JSON.stringify(results, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
