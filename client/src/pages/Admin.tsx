import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Edit, Plus, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [editingColab, setEditingColab] = useState<any>(null);
  const [newColab, setNewColab] = useState({
    codigo: "",
    nome: "",
    loja: "",
    funcao: "",
    empresa: "Expressglass SA",
  });

  const utils = trpc.useUtils();
  const { data: colaboradores, isLoading: loadingColabs } = trpc.colaboradores.list.useQuery();
  const { data: relatorios, isLoading: loadingRels } = trpc.relatorios.list.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const createColab = trpc.colaboradores.create.useMutation({
    onSuccess: () => {
      toast.success("Colaborador criado com sucesso!");
      utils.colaboradores.list.invalidate();
      setNewColab({
        codigo: "",
        nome: "",
        loja: "",
        funcao: "",
        empresa: "Expressglass SA",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar colaborador: " + error.message);
    },
  });

  const updateColab = trpc.colaboradores.update.useMutation({
    onSuccess: () => {
      toast.success("Colaborador atualizado!");
      utils.colaboradores.list.invalidate();
      setEditingColab(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar: " + error.message);
    },
  });

  const deleteColab = trpc.colaboradores.delete.useMutation({
    onSuccess: () => {
      toast.success("Colaborador eliminado!");
      utils.colaboradores.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao eliminar: " + error.message);
    },
  });

  const deleteRel = trpc.relatorios.delete.useMutation({
    onSuccess: () => {
      toast.success("Relatório eliminado!");
      utils.relatorios.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao eliminar: " + error.message);
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">A carregar...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img 
                src="/logo-expressglass.png" 
                alt="ExpressGlass" 
                className="h-16 mx-auto bg-white px-6 py-2 rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl">Bem-vindo</CardTitle>
            <CardDescription>Faça login na sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Não tem permissões para aceder a esta área.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo-expressglass.png" alt="ExpressGlass" className="h-10" />
            <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name || user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="colaboradores" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="colaboradores" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestão de Colaboradores</CardTitle>
                    <CardDescription>Adicionar, editar ou eliminar colaboradores</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Colaborador
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Colaborador</DialogTitle>
                        <DialogDescription>Preencha os dados do novo colaborador</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-codigo">Código</Label>
                          <Input
                            id="new-codigo"
                            value={newColab.codigo}
                            onChange={(e) => setNewColab({ ...newColab, codigo: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-nome">Nome</Label>
                          <Input
                            id="new-nome"
                            value={newColab.nome}
                            onChange={(e) => setNewColab({ ...newColab, nome: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-loja">Loja</Label>
                          <Input
                            id="new-loja"
                            value={newColab.loja}
                            onChange={(e) => setNewColab({ ...newColab, loja: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-funcao">Função</Label>
                          <Input
                            id="new-funcao"
                            value={newColab.funcao}
                            onChange={(e) => setNewColab({ ...newColab, funcao: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => createColab.mutate(newColab)}>
                          Criar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingColabs ? (
                  <div className="text-center py-8">A carregar...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Loja</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colaboradores?.map((colab) => (
                        <TableRow key={colab.id}>
                          <TableCell>{colab.codigo}</TableCell>
                          <TableCell>{colab.nome}</TableCell>
                          <TableCell>{colab.loja}</TableCell>
                          <TableCell>{colab.funcao}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingColab(colab)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Colaborador</DialogTitle>
                                  </DialogHeader>
                                  {editingColab && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Código</Label>
                                        <Input
                                          value={editingColab.codigo}
                                          onChange={(e) =>
                                            setEditingColab({ ...editingColab, codigo: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Nome</Label>
                                        <Input
                                          value={editingColab.nome}
                                          onChange={(e) =>
                                            setEditingColab({ ...editingColab, nome: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Loja</Label>
                                        <Input
                                          value={editingColab.loja}
                                          onChange={(e) =>
                                            setEditingColab({ ...editingColab, loja: e.target.value })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Função</Label>
                                        <Input
                                          value={editingColab.funcao}
                                          onChange={(e) =>
                                            setEditingColab({ ...editingColab, funcao: e.target.value })
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        if (editingColab) {
                                          updateColab.mutate({
                                            id: editingColab.id,
                                            codigo: editingColab.codigo,
                                            nome: editingColab.nome,
                                            loja: editingColab.loja,
                                            funcao: editingColab.funcao,
                                          });
                                        }
                                      }}
                                    >
                                      Guardar
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Tem a certeza que deseja eliminar este colaborador?")) {
                                    deleteColab.mutate({ id: colab.id });
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Submetidos</CardTitle>
                <CardDescription>Visualizar e gerir relatórios de despesas</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRels ? (
                  <div className="text-center py-8">A carregar...</div>
                ) : !relatorios || relatorios.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum relatório submetido ainda
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>KM</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorios.map((rel) => {
                        const colab = colaboradores?.find((c) => c.id === rel.colaboradorId);
                        return (
                          <TableRow key={rel.id}>
                            <TableCell>{rel.data}</TableCell>
                            <TableCell>{colab?.nome || "N/A"}</TableCell>
                            <TableCell>{rel.matricula}</TableCell>
                            <TableCell>{rel.localidade}</TableCell>
                            <TableCell>{rel.klm} km</TableCell>
                            <TableCell>{(rel.totalDespesas / 100).toFixed(2)} €</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Tem a certeza que deseja eliminar este relatório?")) {
                                    deleteRel.mutate({ id: rel.id });
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

