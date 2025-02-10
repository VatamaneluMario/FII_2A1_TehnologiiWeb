package org.example;

import java.io.File;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Random;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import org.testng.annotations.Test;


public class Main {
    public static void main(String[] args) {
        String path = args[0];
        try {
            List<Class<?>> classes = loadClasses(path);
            for (Class<?> cls : classes) {
                printClassPrototype(cls);
                invokeTestMethods(cls);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static List<Class<?>> loadClasses(String path) throws IOException, ClassNotFoundException {
        File input = new File(path);
        List<Class<?>> classes = new ArrayList<>();

        if (input.isDirectory()) {
            File[] files = input.listFiles();
            if (files != null) {
                for (File file : files) {
                    classes.addAll(loadClasses(file.getPath()));
                }
            }
        } else if (input.getName().endsWith(".jar")) {
            JarFile jarFile = new JarFile(input);
            Enumeration<JarEntry> entries = jarFile.entries();
            URL[] urls = { new URL("jar:file:" + input + "!/") };
            URLClassLoader cl = URLClassLoader.newInstance(urls);

            while (entries.hasMoreElements()) {
                JarEntry je = entries.nextElement();
                if(je.getName().endsWith(".class") && !je.isDirectory()) {
                    String className = je.getName().substring(0, je.getName().length() - 6);
                    className = className.replace('/', '.');
                    Class<?> c = cl.loadClass(className);
                    classes.add(c);
                }
            }
            jarFile.close();
        } else if (input.getName().endsWith(".class")) {
            URL url = input.getParentFile().toURI().toURL();
            URLClassLoader classLoader = URLClassLoader.newInstance(new URL[]{url});
            String className = input.getName().replace(".class", "");
            Class<?> cls = Class.forName(className, true, classLoader);
            classes.add(cls);
        }
        return classes;
    }


    private static void printClassPrototype(Class<?> cls) {
        System.out.println("Class: " + cls.getName());
        Method[] methods = cls.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method.toString());
        }
    }

    private static void invokeTestMethods(Class<?> cls) throws IllegalAccessException, InvocationTargetException, InstantiationException {
        Object instance = cls.newInstance();
        for (Method method : cls.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Test.class)) {
                if (method.getParameterCount() == 0) {
                    method.invoke((method.getModifiers() & java.lang.reflect.Modifier.STATIC) != 0 ? null : instance);
                } else {
                    Object[] mockParams = generateMockParams(method.getParameterTypes());
                    method.invoke((method.getModifiers() & java.lang.reflect.Modifier.STATIC) != 0 ? null : instance, mockParams);
                }
            }
        }
    }

    private static Object[] generateMockParams(Class<?>[] paramTypes) {
        Random random = new Random();
        Object[] params = new Object[paramTypes.length];
        for (int i = 0; i < paramTypes.length; i++) {
            if (paramTypes[i] == int.class) {
                params[i] = random.nextInt();
            } else if (paramTypes[i] == String.class) {
                params[i] = "test" + random.nextInt(100);
            }
        }
        return params;
    }
}
